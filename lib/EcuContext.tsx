import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCompetition } from './CompetitionProvider';
import {
  encodeRequest,
  getConfigFetchRequest,
  getConfigSetRequest,
  getStatusRequest,
  parseResponse,
} from './evo_proto';
import useNotifications from './NotificationContext';
import {
  ConfigContent,
  StatusResponse,
  Response,
  Request,
} from './proto/evolocity';
import { PortState, SerialMessage, useSerial } from './SerialProvider';
import Team from './TeamInterface';
import {Text} from '@mantine/core'

export type EcuState =
  | 'Disconnected'
  | 'Fetching Status'
  | 'Fetching Config'
  | 'Sending Config'
  | 'Ready';

export type EcuInfo = {
  config: ConfigContent;
  status: StatusResponse;
};

interface IEcuContext {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  refreshEcu: () => void;
  ecuState: EcuState;
  ecuInfo: EcuInfo;
  ecuTeam: Team;
  setEcuTeam: (t: Team) => void;
}

const EcuContext = createContext<Partial<IEcuContext>>({});

type EcuProviderProps = {
  children: ReactNode;
};

export const EcuProvider = ({ children }: EcuProviderProps) => {
  const { portState, connect, disconnect, subscribe, sendBuf } =
    useSerial();

  const { addNotification } = useNotifications();

  const { teams } = useCompetition();
  const [team, setTeam] = useState<Team | undefined>(undefined);

  const inputArrayRef = useRef<Uint8Array>();
  const [ecuInfo, setEcuInfo] = useState<EcuInfo | undefined>(undefined);
  const [ecuState, setEcuState] = useState<EcuState>('Disconnected');
  const activeTimeouts = useRef<number[]>([]);

  const sendRequest = useCallback(
    (request: Request) => {
      const buf = encodeRequest(request);
      const out = new Uint8Array(buf.length + 1);
      out.set(buf);
      sendBuf(out);
    },
    [sendBuf]
  );

  const getConfig = useCallback(() => {
    if (ecuState === 'Ready' && portState === 'open') {
      setEcuState('Fetching Config');
      sendRequest(getConfigFetchRequest());
    }
    if (ecuState === 'Fetching Config') sendRequest(getConfigFetchRequest());
  }, [ecuState, portState, sendRequest]);

  const getStatus = useCallback(() => {
    if (ecuState === 'Ready' && portState == 'open') {
      setEcuState('Fetching Status');
      sendRequest(getStatusRequest());
    }
    if (ecuState === 'Fetching Status') sendRequest(getStatusRequest());
  }, [ecuState, portState, sendRequest]);

  const refreshEcu = useCallback(() => {
    getConfig();
    getStatus();
  }, [getConfig, getStatus]);

  const setEcuTeam = useCallback(
    (t: Team) => {
      sendRequest(
        getConfigSetRequest({
          teamNumber: t.id,
          vehicleClass: t.class,
          serialNumber: t.id,
        })
      );
    },
    [sendRequest]
  );

  useEffect(() => {
    if (portState === 'open') {
      setEcuState('Ready');
      addNotification({ type: 'success', title: 'Connected', content: <Text>ECU Connected</Text> });
    }
    if (portState === 'closed') {
      setEcuState('Disconnected');
      setEcuInfo(undefined);
      addNotification({
        type: 'failure',
        title: 'Disconnected',
        content: <Text>ECU Disconnected</Text>,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portState]);

  useEffect(() => {
    if (ecuState === 'Ready' && ecuInfo === undefined) {
      console.log('new open, getting config');
      getConfig();
    }

    if (ecuState === 'Fetching Config') {
      activeTimeouts.current.push(window?.setTimeout(getConfig, 5000));
    }

    if (ecuState === 'Fetching Status') {
      activeTimeouts.current.push(window?.setTimeout(getStatus, 5000));
    }
  }, [ecuInfo, ecuState, getConfig, getStatus]);

  const responseHandler = useCallback(
    (response: Response) => {
      if (
        response.config !== undefined &&
        response.config.content !== undefined
      ) {
        console.log('Config Received', response.config.content);
        setEcuInfo({ ...ecuInfo, config: response.config.content });
      }
      if (response.status !== undefined) {
        console.log('Status Received', response.status);
        setEcuInfo({ ...ecuInfo, status: response.status });
      }
      if (response.ack !== undefined) {
        console.log('Ack Received');
      }
    },
    [ecuInfo]
  );

  const inputHandler = useCallback(
    (message: SerialMessage) => {
      console.log('input message', message.value);
      const inputAsString = new TextDecoder().decode(message.value);
      console.log('input as string', inputAsString);
      const oldRef = inputArrayRef.current;
      const appendMode =
        inputArrayRef.current !== undefined && inputArrayRef.current.length;
      if (appendMode) {
        inputArrayRef.current = new Uint8Array(
          oldRef.length + message.value.length
        );
        inputArrayRef.current.set(oldRef);
        inputArrayRef.current.set(message.value, oldRef.length);
      } else {
        inputArrayRef.current = message.value;
      }

      const fullMessageReceived =
        inputArrayRef.current.length - 1 === inputArrayRef.current.at(0);

      if (fullMessageReceived) {
        const input = inputArrayRef.current.slice(
          1,
          inputArrayRef.current.at(0) + 1
        );
        const newRef = inputArrayRef.current.slice(
          inputArrayRef.current.at(0) + 1
        );
        inputArrayRef.current = newRef;

        try {
          responseHandler(parseResponse(input));
        } catch (e) {
          const hexString = Array.from(input)
            .map((c) => c.toString(16))
            .map((s) => (s === '0' ? '00' : s))
            .toString();
          console.log(hexString.replaceAll(',', ' '));
          console.log('input error', e);
          console.log('input hex buf: [' + hexString + ']');
        } finally {
          setEcuState('Ready');
          activeTimeouts.current.forEach((n) => clearTimeout(n));
          activeTimeouts.current = [];
        }
      }
    },
    [responseHandler]
  );

  useEffect(() => {
    const unsub = subscribe(inputHandler);
    return () => {
      unsub();
    };
  }, [subscribe, inputHandler]);

  useEffect(() => {
    if (ecuInfo !== undefined) {
      setTeam(teams?.find((t) => t.id === ecuInfo.config.teamNumber));
    }
  }, [ecuInfo, teams]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      refreshEcu,
      ecuState,
      ecuInfo,
      ecuTeam: team,
      setEcuTeam,
    }),
    [
      connect,
      disconnect,
      ecuInfo,
      ecuState,
      refreshEcu,
      setEcuTeam,
      team,
    ]
  );

  return <EcuContext.Provider value={value}>{children}</EcuContext.Provider>;
};
const useEcu = () => useContext(EcuContext);
export default useEcu;
