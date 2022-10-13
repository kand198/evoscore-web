import { Alert, Group, Stack, Title, Button, Text, Indicator, DefaultMantineColor } from '@mantine/core';
import Link from 'next/link';
import { useMemo } from 'react';
import { Activity, Clock, Refresh, Trash } from 'tabler-icons-react';
import EcuInfo from '../components/EcuInfo';
import EnergyFetch from '../components/EnergyFetch';
import TeamSelect from '../components/TeamSelect';
import EcuChart from '../components/EcuChart';
import useEcu from '../lib/EcuContext';
import { useSerial } from '../lib/SerialProvider';

const ECU = () => {
  const { ecuState, connect, disconnect, setTime, resetEcu, energyFrames, timeDelta } = useEcu();
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
    <Group className='w-full justify-between'>
      <Group className='items-center'>
        <Indicator position='middle-end' offset={-4} color={statusColour}>
          <Title order={1} className='pr-1 whitespace-nowrap'>
            ECU Configurator
          </Title>
        </Indicator>
        <Text>{ecuState}</Text>
      </Group>
      <Group className='flex-nowrap'>
        <Button className='bg-blue-600 hover:bg-blue-800' onClick={() => connect()} disabled={ecuState !== 'Disconnected'}>
          Manually Connect
        </Button>
        <Button className='bg-blue-600 hover:bg-blue-800' onClick={() => disconnect()} disabled={ecuState !== 'Ready'}>
          Disconnect
        </Button>
      </Group>
    </Group>
  );

  const EcuControls = () => (
    <Group>
      <Text>Time Delta (seconds): {timeDelta}</Text>
      <Button className='bg-blue-600 hover:bg-blue-800' onClick={() => setTime(Date.now())} disabled={ecuState !== 'Ready'} leftIcon={<Clock />}>
        <Text>Sync Time</Text>
      </Button>
      <Button className='bg-red-600 hover:bg-red-800' onClick={() => resetEcu()} disabled={ecuState !== 'Ready'} leftIcon={<Trash />}>
        <Text>Reset</Text>
      </Button>
    </Group>
  );

  return (
    <Stack className='relative h-full max-w-4xl'>
      {canUseSerial ? (
        <Stack>
          <TitleGroup />
          <TeamSelect />
          <EcuInfo />
          <EnergyFetch />
          <EcuControls />
          <EcuChart energyFrames={energyFrames} />
        </Stack>
      ) : (
        <Alert title='Incompatible Browser Detected!' color='red' className='w-fit m-auto' variant='filled'>
          It seems that your browser doesn&#39;t support the <Link href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API'>Web Serial API.</Link>
          <br />
          Please, <Link href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility'>
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
