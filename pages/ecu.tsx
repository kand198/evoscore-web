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
import { Activity, Clock, Refresh, Trash } from 'tabler-icons-react';
import EcuInfo from '../components/EcuInfo';
import EnergyFetch from '../components/EnergyFetch';
import TeamSelect from '../components/TeamSelect';
import useEcu from '../lib/EcuContext';
import { useSerial } from '../lib/SerialProvider';

const ECU = () => {
  const { ecuState, connect, disconnect, refreshEcu, setTime, getEnergy } = useEcu();
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
        className='bg-blue-600 hover:bg-blue-800'
        onClick={() => connect()}
        disabled={ecuState !== 'Disconnected'}
      >
        Manually Connect
      </Button>
      <Button
        className='bg-blue-600 hover:bg-blue-800'
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
        className='bg-blue-600 hover:bg-blue-800'
        onClick={refreshEcu}
        disabled={ecuState !== 'Ready'}
        leftIcon={<Refresh />}
      >
        <Text>Refresh Status</Text>
      </Button>
      <Button
        className='bg-blue-600 hover:bg-blue-800'
        onClick={() => setTime(Date.now())}
        disabled={ecuState !== 'Ready'}
        leftIcon={<Clock />}
      >
        <Text>Sync Time</Text>
      </Button>
      <Button
        className='bg-blue-600 hover:bg-blue-800'
        onClick={() => getEnergy([0,1])}
        disabled={ecuState !== 'Ready'}
        leftIcon={<Activity />}
      >
        <Text>Get Energy</Text>
      </Button>
      <Button
        className='bg-red-600 hover:bg-red-800'
        disabled={ecuState !== 'Ready'}
        leftIcon={<Trash />}
      >
        <Text>Reset</Text>
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
          <EnergyFetch />
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
