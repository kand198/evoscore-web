import {
  Alert,
  Group,
  Stack,
  Notification,
  Title,
  Button,
  ScrollArea,
  Code,
  Loader,
} from '@mantine/core';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, X } from 'tabler-icons-react';
import { emptyRequest } from '../lib/evo_proto';
import { SerialMessage, useSerial } from '../lib/SerialProvider';

const ECU = () => {
  const { canUseSerial, portState, connect, disconnect, subscribe, sendLine } =
    useSerial();
  const [inputArray, setInputArray] = useState<string[]>([]);
  const inputArrayRef = useRef<string[]>([]);
  const [notify, setNotify] = useState(false);

  const closeNotification = () => setNotify(false);

  const printEmptyThingy = () => {
    const buf = emptyRequest();
    const s = Array.from(buf).map((c) => c.toString(16)).map((s) => s === '0' ? '00' : s).toString().replace(',','');
    console.log(s);
    sendLine(s);
  };

  useEffect(() => {
    setNotify(true);
  }, [portState]);

  const test = useCallback(
    (message: SerialMessage) => {
      inputArrayRef.current.push(message.value);
      setInputArray([...inputArrayRef.current]);
    },
    [inputArrayRef]
  );

  useEffect(() => {
    const unsub = subscribe(test);
    return () => {
      unsub();
    };
  }, [subscribe, test]);

  useEffect(() => {
    inputArrayRef.current = inputArray;
  }, [inputArray]);

  const input = useMemo(
    () =>
      inputArray.length > 0 ? inputArray.reduce((s, a) => s.concat(a)) : '',
    [inputArray]
  );

  return (
    <Stack className='relative h-full'>
      <Title order={1}>ECU Configurator</Title>
      {canUseSerial ? (
        <Stack>
          <Group>
            <Button className='bg-blue-600' onClick={() => connect()}>
              Connect
            </Button>
            <Button className='bg-blue-600' onClick={() => disconnect()}>
              Disconnect
            </Button>
            <Button className='bg-blue-600' onClick={() => sendLine('2200')}>
              Send
            </Button>
            <Button className='bg-blue-600' onClick={printEmptyThingy}>
              Print demo
            </Button>
          </Group>
          <ScrollArea>
            <Code block>{input}</Code>
          </ScrollArea>
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
      {notify && portState === 'open' && (
        <Notification
          icon={<Check size={18} />}
          color='teal'
          title='Connected'
          onClose={closeNotification}
          className="absolute bottom-0 inset-x-0"
        >
          ECU Port Successfully Opened.
        </Notification>
      )}
      {notify && portState === 'closed' && (
        <Notification
          icon={<X size={18} />}
          color='red'
          title='Disconnected'
          onClose={closeNotification}
          className="absolute bottom-0 inset-x-0"
        >
          ECU Port Closed.
        </Notification>
      )}
      {notify && portState.includes('ing') && (
        <Notification
          loading
          title='Waiting on Connection'
          disallowClose
          className="absolute bottom-0 inset-x-0"
        >
          {portState.charAt(0).toUpperCase() + portState.slice(1)} the ECU port.
        </Notification>
      )}
    </Stack>
  );
};

export default ECU;
