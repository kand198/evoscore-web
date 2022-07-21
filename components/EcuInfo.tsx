import { Button, Group, Stack, Text } from '@mantine/core';
import { Refresh } from 'tabler-icons-react';
import useEcu from '../lib/EcuContext';
import { vehicleClassMap } from '../lib/TeamInterface';

const EcuInfo = () => {
  const { ecuInfo, refreshEcu, ecuState, ecuTeam } = useEcu();
  console.log(ecuTeam);
  return (
    <Stack>
      <Group>
        <Text>
          ECU Serial Number:{' '}
          {ecuInfo?.config?.serialNumber?.toString()}
        </Text>
        <Text>
          Team ID:{' '}
          {ecuInfo?.config?.teamNumber?.toString()}
        </Text>
        <Text>
          Team Name:{' '}
          {ecuTeam?.name}
        </Text>
        <Text>
          Vehicle Class:{' '}
          {ecuInfo?.config?.vehicleClass !== undefined
            ? vehicleClassMap.get(ecuInfo?.config?.vehicleClass)
            : ''}
        </Text>
      </Group>
      <Group>
        <Text>
          Uptime:{' '}
          {ecuInfo?.status?.uptime !== undefined
            ? ecuInfo?.status.uptime
            : ''}
        </Text>
        <Text>
          Flash Usage:{' '}
          {ecuInfo?.status?.flashUsage !== undefined
            ? ecuInfo?.status.flashUsage
            : ''}
        </Text>
        <Text>
          Temperature:{' '}
          {ecuInfo?.status?.temperature !== undefined
            ? ecuInfo?.status.temperature
            : ''}
        </Text>
        <Text>
          Voltage:{' '}
          {ecuInfo?.status?.voltage !== undefined
            ? ecuInfo?.status.voltage
            : ''}
        </Text>
        <Text>
          Current:{' '}
          {ecuInfo?.status?.current !== undefined
            ? ecuInfo?.status.current
            : ''}
        </Text>
        <Button
          className='bg-blue-600 hover:bg-blue-800'
          onClick={refreshEcu}
          disabled={ecuState !== 'Ready'}
          leftIcon={<Refresh />}
        >
          <Text>Refresh Status</Text>
        </Button>
      </Group>
    </Stack>
  );
};

export default EcuInfo;
