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
  getEnergyRequest,
  getResetRequest,
  getStatusRequest,
  getTimeSetRequest,
  parseResponse,
} from './evo_proto';
import useNotifications from './NotificationContext';
import {
  ConfigContent,
  StatusResponse,
  Response,
  Request,
  EnergyFrame,
} from './proto/evolocity';
import { PortState, SerialMessage, useSerial } from './SerialProvider';
import Team from './TeamInterface';
import { Text, useMantineDefaultProps } from '@mantine/core';
import * as _m0 from 'protobufjs/minimal';

export type EcuState =
  | 'Disconnected'
  | 'Fetching Status'
  | 'Fetching Config'
  | 'Sending Config'
  | 'Fetching Energy'
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
  setTime: (t: number) => void;
  energyFrames: EnergyFrame[];
  getEnergyFrames: (r?: [s: number, e: number]) => void;
  clearEnergyFrames: () => void;
  resetEcu: () => void;
  timeDelta: number;
}

const EcuContext = createContext<Partial<IEcuContext>>({});

type EcuProviderProps = {
  children: ReactNode;
};

export const EcuProvider = ({ children }: EcuProviderProps) => {
  const { portState, connect, disconnect, subscribe, sendBuf } = useSerial();

  const { addNotification } = useNotifications();

  const { teams } = useCompetition();
  const [team, setTeam] = useState<Team | undefined>(undefined);

  const inputArrayRef = useRef<Uint8Array>();

  const [ecuInfo, setEcuInfo] = useState<EcuInfo | undefined>(undefined);
  const [ecuState, setEcuState] = useState<EcuState>('Disconnected');
  const [timeDelta, setTimeDelta] = useState(0);

  const [energyFrames, setEnergyFrames] = useState<EnergyFrame[]>([]);
  const energyFramesRef = useRef<EnergyFrame[]>([]);

  const incrementingId = useRef<number>(0);
  const timeRange = useRef<[number, number]>([0, 0]);

  const activeRequest = useRef<Request | undefined>();
  const [request, setRequest] = useState<Request | undefined>();

  const addEnergyFrames = (ef: EnergyFrame[]) => {
    const newEfTimestamps = ef.map((ef) => ef.endTimestamp);
    energyFramesRef.current = [
      ...ef,
      ...energyFramesRef.current.filter(
        (frame) => !newEfTimestamps.includes(frame.endTimestamp)
      ),
    ];
    setEnergyFrames(energyFramesRef.current);
  };

  const clearEnergyFrames = useCallback(() => {
    energyFramesRef.current = [];
    setEnergyFrames([]);
  }, []);

  useEffect(() => {
    energyFramesRef.current = energyFrames;
  }, [energyFrames]);

  const sendRequest = useCallback(
    (r: Request) => {
      const finalRequest: Request = {
        ...r,
        uid: r.uid > 0 ? r.uid : incrementingId.current,
        timestamp: Date.now() / 1000,
      };
      activeRequest.current = { ...finalRequest };
      setRequest(activeRequest.current);
      incrementingId.current = incrementingId.current + 1;
      const buf = encodeRequest(finalRequest);
      const out = new Uint8Array(buf.length + 1);
      out.set(buf);
      sendBuf(out);
    },
    [sendBuf]
  );

  useEffect(() => {
    const uidToResend = request?.uid;
    const timeout = setTimeout(() => {
      if (activeRequest.current !== undefined && activeRequest.current.uid === uidToResend) sendRequest(activeRequest.current)
    }, 5000);
    return () => clearTimeout(timeout);
  }, [request, sendRequest])

  useEffect(() => {
    if (portState === 'open') {
      if (request === undefined) setEcuState('Ready');
      else if (request.config !== undefined) setEcuState('Fetching Config');
      else if (request.energy !== undefined) setEcuState('Fetching Energy');
      else if (request.reset !== undefined) setEcuState('Fetching Status');
      else if (request.status !== undefined) setEcuState('Fetching Status');
      else if (request.time !== undefined) setEcuState('Fetching Status');
    }
  }, [portState, request, sendRequest]);

  const getConfig = useCallback(() => {
    sendRequest(getConfigFetchRequest());
  }, [sendRequest]);

  const getStatus = useCallback(() => {
    sendRequest(getStatusRequest());
  }, [sendRequest]);

  const refreshEcu = useCallback(() => {
    getStatus();
  }, [getStatus]);

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

  const setTime = useCallback(
    (t: number) => sendRequest(getTimeSetRequest(0)),
    [sendRequest]
  );

  const getEnergyFrames = useCallback(
    (r?: [s: number, e: number]) => {
      timeRange.current = r || [0, 0];
      sendRequest(getEnergyRequest(r));
    },
    [sendRequest]
  );

  const resetEcu = useCallback(
    () => sendRequest(getResetRequest()),
    [sendRequest]
  );

  useEffect(() => {
    if (portState === 'open') {
      setEcuState('Ready');
      addNotification({
        type: 'success',
        title: 'Connected',
        content: <Text>ECU Connected</Text>,
      });
    }
    if (portState === 'closed') {
      setEcuState('Disconnected');
      setEcuInfo(undefined);
      addNotification({
        type: 'failure',
        title: 'Disconnected',
        content: <Text>ECU Disconnected</Text>,
      });
      setTeam(undefined);
      inputArrayRef.current = new Uint8Array();
      setTimeDelta(0);
      energyFramesRef.current = [];
      setEnergyFrames([]);
      timeRange.current = [0,0];
      activeRequest.current = undefined;
      setRequest(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portState]);

  useEffect(() => {
    if (ecuState === 'Ready' && ecuInfo === undefined) {
      getConfig();
    }
  }, [ecuInfo, ecuState, getConfig, getStatus]);

  const responseHandler = useCallback(
    (response: Response) => {
      const matchingRequest = activeRequest.current.uid === response.uid;
      if (matchingRequest) {
        console.log('timeout cleared');
        activeRequest.current = undefined;
        setRequest(activeRequest.current);
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
        if (
          response.energy !== undefined &&
          response.energy.frames !== undefined
        ) {
          console.log('Energy Received', response.energy.frames);
          addEnergyFrames(response.energy.frames);
          if (
            response.energy.frames.length == 16 &&
            response.energy.frames[response.energy.frames.length - 1]
              .endTimestamp < timeRange.current[1]
          )
            getEnergyFrames([
              response.energy.frames[response.energy.frames.length - 1]
                .endTimestamp + 1,
              timeRange.current[1],
            ]);
          else timeRange.current = [0, 0];
        }
        if (response.timestamp !== undefined)
          setTimeDelta(
            new Date(Date.now() / 1000 - response.timestamp).getTime()
          );
      } else {
        console.log('mismatch')
        sendRequest(activeRequest.current)
      }
    },
    [ecuInfo, getEnergyFrames, sendRequest]
  );

  const inputHandler = useCallback(
    (message: SerialMessage) => {
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

      try {
        const lengthReader = new _m0.Reader(inputArrayRef.current);
        const encodedLength = lengthReader.uint32();
        const offset = lengthReader.pos;

        const fullMessageReceived =
          inputArrayRef.current.length - offset >= encodedLength;

        if (fullMessageReceived) {
          const input = inputArrayRef.current.slice(
            offset,
            encodedLength + offset
          );
          const newRef = inputArrayRef.current.slice(encodedLength + offset);
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
            sendRequest(activeRequest.current);
          }
        }
      } catch (e) {}
    },
    [responseHandler, sendRequest]
  );

  useEffect(() => {
    const unsub = subscribe(inputHandler);
    return () => {
      unsub();
    };
  }, [subscribe, inputHandler]);

  useEffect(() => {
    if (ecuInfo !== undefined && ecuInfo.config !== undefined) {
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
      setTime,
      energyFrames,
      getEnergyFrames,
      clearEnergyFrames,
      resetEcu,
      timeDelta,
    }),
    [
      connect,
      disconnect,
      ecuInfo,
      ecuState,
      refreshEcu,
      setEcuTeam,
      setTime,
      energyFrames,
      getEnergyFrames,
      clearEnergyFrames,
      resetEcu,
      team,
      timeDelta,
    ]
  );

  return <EcuContext.Provider value={value}>{children}</EcuContext.Provider>;
};
const useEcu = () => useContext(EcuContext);
export default useEcu;
