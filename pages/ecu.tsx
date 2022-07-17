import {
  Alert,
  Group,
  Stack,
  Title,
  Button,
  Text,
  Indicator,
  DefaultMantineColor,
} from '@mantine/core';
import Link from 'next/link';
import { useMemo } from 'react';
import { Refresh, Trash } from 'tabler-icons-react';
import EcuInfo from '../components/EcuInfo';
import TeamSelect from '../components/TeamSelect';
import useEcu from '../lib/EcuContext';
import { useSerial } from '../lib/SerialProvider';

const ECU = () => {
  const { ecuState, connect, disconnect, refreshEcu } = useEcu();
  const { canUseSerial } = useSerial();

  const statusColour: DefaultMantineColor = useMemo(() => {
    switch (ecuState) {
      case 'Disconnected':
        return 'red';
      case 'Ready':
        return 'green';
      default:
        return 'orange';
    }
  }, [ecuState]);

  const TitleGroup = () => (
    <Group className='items-center'>
      <Indicator position='middle-end' offset={-4} color={statusColour}>
        <Title order={1} className='pr-1'>
          ECU Configurator
        </Title>
      </Indicator>
      <Text>{ecuState}</Text>
    </Group>
  );

  const ConnectionControls = () => (
    <Group>
      <Button
        className='bg-blue-600'
        onClick={() => connect()}
        disabled={ecuState !== 'Disconnected'}
      >
        Manually Connect
      </Button>
      <Button
        className='bg-blue-600'
        onClick={() => disconnect()}
        disabled={ecuState !== 'Ready'}
      >
        Disconnect
      </Button>
    </Group>
  );

  const EcuControls = () => (
    <Group>
      <Button
        className='bg-blue-600'
        onClick={refreshEcu}
        disabled={ecuState !== 'Ready'}
      >
        <Refresh />
      </Button>
      <Button className='bg-red-600' disabled={ecuState !== 'Ready'}>
        <Trash />
      </Button>
    </Group>
  );

  return (
    <Stack className='relative h-full'>
      {canUseSerial ? (
        <Stack>
          <TitleGroup />
          <ConnectionControls />
          <TeamSelect />
          <EcuInfo />
          <EcuControls />
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
