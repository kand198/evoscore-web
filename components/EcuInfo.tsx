import { Group, Stack, Text } from '@mantine/core';
import useEcu from '../lib/EcuContext';
import { vehicleClassMap } from '../lib/TeamInterface';

const EcuInfo = () => {
  const { ecuInfo } = useEcu();
  return (
    <Stack>
      <Group>
        <Text>
          Serial Number:{' '}
          {ecuInfo?.config?.serialNumber !== undefined
            ? ecuInfo?.config.serialNumber
            : 'Unknown'}
        </Text>
        <Text>
          Team Number:{' '}
          {ecuInfo?.config?.teamNumber !== undefined
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
      <Group>
        <Text>
          Uptime:{' '}
          {ecuInfo?.status?.uptime !== undefined
            ? ecuInfo?.status.uptime
            : 'Unknown'}
        </Text>
        <Text>
          Flash Usage:{' '}
          {ecuInfo?.status?.flashUsage !== undefined
            ? ecuInfo?.status.flashUsage
            : 'Unknown'}
        </Text>
        <Text>
          Temperature:{' '}
          {ecuInfo?.status?.temperature !== undefined
            ? ecuInfo?.status.temperature
            : 'Unknown'}
        </Text>
        <Text>
          Voltage:{' '}
          {ecuInfo?.status?.voltage !== undefined
            ? ecuInfo?.status.voltage
            : 'Unknown'}
        </Text>
        <Text>
          Current:{' '}
          {ecuInfo?.status?.current !== undefined
            ? ecuInfo?.status.current
            : 'Unknown'}
        </Text>
        <Text>Energy: (coming soon)</Text>
      </Group>
    </Stack>
  );
};

export default EcuInfo;
