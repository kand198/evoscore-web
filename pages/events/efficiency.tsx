import {
  Anchor,
  Breadcrumbs,
  Group,
  NumberInput,
  Stack,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import EfficiencyTable from '../../components/EfficiencyTable';
import { useCompetition } from '../../lib/CompetitionProvider';

const Efficiency = () => {
  const { laps, setLaps } = useCompetition();

  return (
    <Stack>
      <Breadcrumbs>
        <Link passHref href='/events' key={0}>
          <Anchor>Events</Anchor>
        </Link>
        <Link passHref href='/events/efficiency' key={1}>
          <Anchor>Efficiency</Anchor>
        </Link>
      </Breadcrumbs>
      <Group className='items-center'>
        <Title>Efficiency</Title>
        <NumberInput
          value={laps}
          onChange={(val) => setLaps(val)}
          label='Number of Laps'
        />
      </Group>
      <EfficiencyTable />
    </Stack>
  );
};

export default Efficiency;
