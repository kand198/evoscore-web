import {
  Alert,
  Group,
  Stack,
  Text,
  Title,
  Button,
  ScrollArea,
  Code,
} from '@mantine/core';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SerialMessage, useSerial } from '../lib/SerialProvider';

const ECU = () => {
  const {canUseSerial, portState, connect, disconnect, subscribe, sendLine} = useSerial();
  const [inputArray, setInputArray] = useState<string[]>([]);
  const inputArrayRef = useRef<string[]>([]);

  const test = useCallback((message: SerialMessage) => {
    inputArrayRef.current.push(message.value);
    setInputArray([...inputArrayRef.current]);
  }, [inputArrayRef])

  useEffect(() => {
    const unsub = subscribe(test);
    return () => {
      unsub();
    };
  }, [subscribe, test])
  
  useEffect(() => {
    inputArrayRef.current = inputArray;
  }, [inputArray])

  const input = useMemo(() => inputArray.length > 0 ? inputArray.reduce((s, a) => s.concat(a)) : '', [inputArray]);

  return (
    <Stack>
      <Title order={1}>ECU Configurator</Title>
      {canUseSerial ? (
        <Stack>
          <Text>Your browser is compatible!</Text>
          <Group>
            <Button className='bg-blue-600' onClick={() => connect()}>
              Connect
            </Button>
            <Button className='bg-blue-600' onClick={() => disconnect()}>
              Disconnect
            </Button>
            <Button className='bg-blue-600' onClick={() => sendLine("2200")}>
              Send
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
    </Stack>
  );
};

export default ECU;
