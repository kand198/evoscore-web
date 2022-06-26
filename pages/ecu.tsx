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
import { testRequest, parseResponse } from '../lib/evo_proto';
import { SerialMessage, useSerial } from '../lib/SerialProvider';

const ECU = () => {
  const {
    canUseSerial,
    portState,
    connect,
    disconnect,
    subscribe,
    sendLine,
    sendBuf,
  } = useSerial();
  // const [inputArray, setInputArray] = useState<string[]>([]);
  const inputArrayRef = useRef<Uint8Array>();
  const [notify, setNotify] = useState(false);

  const closeNotification = () => setNotify(false);

  const clear = () => (inputArrayRef.current = new Uint8Array());

  const printEmptyThingy = () => {
    const buf = testRequest();
    // const inputAsString = new TextDecoder().decode(buf);
    // console.log("output array strings", inputAsString.split(""));
    const out = new Uint8Array(buf.length + 1);
    out.set(buf);
    console.log('output', out);
    sendBuf(out);
  };

  useEffect(() => {
    setNotify(true);
  }, [portState]);

  const test = useCallback((message: SerialMessage) => {
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

      console.log('input', input);
      console.log('inputRef', inputArrayRef.current);

      try {
        console.log(parseResponse(input));
      } catch (e) {
        const hexString = Array.from(input)
          .map((c) => c.toString(16))
          .map((s) => (s === '0' ? '00' : s))
          .toString();
        console.log(hexString.replaceAll(',', ' '));
        console.log('input error', e);
        console.log('input hex buf: [' + hexString + ']');
      }
    }

    // if (inputArrayRef.current.at(inputArrayRef.current.length - 1) === 0) {
    //   const input = inputArrayRef.current.slice(0, inputArrayRef.current.length - 2);
    //   try {
    //     console.log(parseResponse(input));
    //   } catch (e) {
    //     const inputAsString = new TextDecoder().decode(inputArrayRef.current);
    //     const hexString = Array.from(input)
    //       .map((c) => c.toString(16))
    //       .map((s) => (s === '0' ? '00' : s))
    //       .toString();
    //     console.log(hexString.replaceAll(',', ' '));
    //     console.log('input error', e);
    //     console.log('input hex buf: [' + hexString + ']');
    //   } finally {
    //     clear();
    //   }
    // }
  }, []);

  useEffect(() => {
    const unsub = subscribe(test);
    return () => {
      unsub();
    };
  }, [subscribe, test]);

  // useEffect(() => {
  //   inputArrayRef.current = inputArray;
  // }, [inputArray]);

  // const input = useMemo(
  //   () =>
  //     inputArray.length > 0 ? inputArray.reduce((s, a) => s.concat(a)) : '',
  //   [inputArray]
  // );

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
            <Button className='bg-blue-600' onClick={clear}>
              Clear
            </Button>
          </Group>
          <ScrollArea>
            <Code block>test</Code>
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
          className='absolute bottom-0 inset-x-0'
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
    </Stack>
  );
};

export default ECU;
