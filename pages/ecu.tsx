import {
  Alert,
  Group,
  Stack,
  Notification,
  Title,
  Button,
  Text,
  Select,
  SelectItem,
  Space,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, X } from 'tabler-icons-react';
import { useCompetition } from '../lib/CompetitionProvider';
import {
  parseResponse,
  getConfigFetchRequest,
  encodeRequest,
  getStatusRequest,
  getConfigSetRequest,
} from '../lib/evo_proto';
import {
  ConfigContent,
  Request,
  Response,
  StatusResponse,
} from '../lib/proto/evolocity';
import { SerialMessage, useSerial } from '../lib/SerialProvider';
import Team, { vehicleClassMap } from '../lib/TeamInterface';

type EcuInfo = {
  config: ConfigContent;
  status: StatusResponse;
};

type EcuState =
  | 'Disconnected'
  | 'Fetching Status'
  | 'Fetching Config'
  | 'Sending Config'
  | 'Ready';

const ECU = () => {
  const { canUseSerial, portState, connect, disconnect, subscribe, sendBuf } =
    useSerial();

  const { teams } = useCompetition();
  const [team, setTeam] = useState<Team | undefined>(undefined);

  const inputArrayRef = useRef<Uint8Array>();
  const [notify, setNotify] = useState(false);
  const [ecuInfo, setEcuInfo] = useState<EcuInfo | undefined>(undefined);
  const [ecuState, setEcuState] = useState<EcuState>('Disconnected');
  const activeTimeouts = useRef<number[]>([]);

  const closeNotification = () => setNotify(false);

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

  const getStatus = () => {
    if (ecuState === 'Ready' && portState == 'open') {
      setEcuState('Fetching Status');
      sendRequest(getStatusRequest());
    }
    if (ecuState === 'Fetching Status') sendRequest(getStatusRequest());
  };

  useEffect(() => {
    setNotify(true);
    if (portState === 'open') {
      setEcuState('Ready');
    }
    if (portState === 'closed') {
      setEcuState('Disconnected');
      setEcuInfo(undefined);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecuInfo, ecuState]);

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

  // Update team info
  useEffect(() => {
    if (ecuInfo !== undefined) {
      setTeam(teams?.find((t) => t.id === ecuInfo.config.teamNumber));
    }
  }, [ecuInfo, teams]);
  const form = useForm({
    initialValues: {
      id: '',
    },
  });
  const submitForm = (values: { id: string }) => {
    const team = teams?.find((t) => t.id === parseInt(values.id));
    sendRequest(
      getConfigSetRequest({
        teamNumber: team.id,
        vehicleClass: team.class,
        serialNumber: team.id,
      })
    );
  };
  // Update form info
  useEffect(() => {
    form.setValues({ id: team?.id.toString() || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  return (
    <Stack className='relative h-full'>
      <Title order={1}>ECU Configurator</Title>
      {canUseSerial ? (
        <Stack>
          <Group>
            <Button
              className='bg-blue-600'
              onClick={() => connect()}
              disabled={portState !== 'closed'}
            >
              Manually Connect
            </Button>
            <Button
              className='bg-blue-600'
              onClick={() => disconnect()}
              disabled={portState !== 'open'}
            >
              Disconnect
            </Button>
            <Button
              className='bg-blue-600'
              onClick={getConfig}
              disabled={portState !== 'open' || ecuState !== 'Ready'}
            >
              Get Config
            </Button>
            <Button
              className='bg-blue-600'
              onClick={getStatus}
              disabled={portState !== 'open' || ecuState !== 'Ready'}
            >
              Get Status
            </Button>
          </Group>
          <form
            onSubmit={form.onSubmit((values) => submitForm(values))}
            className='max-w-md'
          >
            <Select
              label='Select the Team for this ECU'
              placeholder='Pick one'
              data={teams?.map<SelectItem>((t) => {
                return { value: t.id.toString(), label: t.name };
              })}
              {...form.getInputProps('id')}
            />
            <Space h='md' />
            <Button type='submit' className='bg-blue-600 hover:bg-blue-800'>
              Submit
            </Button>
          </form>
          <Group>
            <Text>
              Serial Number:{' '}
              {ecuInfo?.config.serialNumber !== undefined
                ? ecuInfo?.config.serialNumber
                : 'Unknown'}
            </Text>
            <Text>
              Team Number:{' '}
              {ecuInfo?.config.teamNumber !== undefined
                ? ecuInfo?.config.teamNumber
                : 'Unknown'}
            </Text>
            <Text>
              Vehicle Class:{' '}
              {ecuInfo?.config?.vehicleClass !== undefined
                ? vehicleClassMap.get(ecuInfo?.config?.vehicleClass)
                : 'Unknown'}
            </Text>
          </Group>
        </Stack>
      ) : (
        <Alert
          title='Incompatible Browser Detected!'
          color='red'
          className='w-fit m-auto'
          variant='filled'
        >
          It seems that your browser doesn&#39;t support the{' '}
          <Link href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API'>
            Web Serial API.
          </Link>
          <br />
          Please,{' '}
          <Link href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility'>
            check if your browser is compatible
          </Link>{' '}
          and try again!
          <br />
          If this problem persists, reach out on Slack for help!
        </Alert>
      )}
      {notify && portState === 'open' && ecuState === 'Ready' && (
        <Notification
          icon={<Check size={18} />}
          color='teal'
          title='Ready'
          onClose={closeNotification}
          className='absolute bottom-0 inset-x-0'
        >
          ECU is Ready.
        </Notification>
      )}
      {notify && portState === 'closed' && (
        <Notification
          icon={<X size={18} />}
          color='red'
          title='Disconnected'
          onClose={closeNotification}
          className='absolute bottom-0 inset-x-0'
        >
          ECU Port Closed.
        </Notification>
      )}
      {notify && portState.includes('ing') && (
        <Notification
          loading
          title='Waiting on Connection'
          disallowClose
          className='absolute bottom-0 inset-x-0'
        >
          {portState.charAt(0).toUpperCase() + portState.slice(1)} the ECU port.
        </Notification>
      )}
      {notify && ecuState.includes('ing') && (
        <Notification
          loading
          title='Processing Request'
          disallowClose
          className='absolute bottom-0 inset-x-0'
        >
          {ecuState}
        </Notification>
      )}
    </Stack>
  );
};

export default ECU;
