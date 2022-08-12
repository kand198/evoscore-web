import {
  Anchor,
  Breadcrumbs,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import EfficiencyTable from '../../components/EfficiencyTable';
import Timer from '../../components/Timer';
import { useCompetition } from '../../lib/CompetitionProvider';

const Efficiency = () => {
  const { laps, setLaps } = useCompetition();
  const [view, setView] = useState('timer');

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
      <SegmentedControl
        value={view}
        onChange={setView}
        data={[
          { label: 'Timer', value: 'timer' },
          { label: 'Results', value: 'results' },
        ]}
      />
      {view === 'timer' && <Timer mode='efficiency' />}
      {view === 'results' && <EfficiencyTable />}
    </Stack>
  );
};

export default Efficiency;
