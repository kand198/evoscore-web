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
import EnduranceTable from '../../components/EnduranceTable';
import Timer from '../../components/Timer';
import { useCompetition } from '../../lib/CompetitionProvider';

const Endurance = () => {
  const { laps, setLaps } = useCompetition();
  const [view, setView] = useState('results');

  return (
    <Stack>
      <Breadcrumbs>
        <Link passHref href='/events' key={0}>
          <Anchor>Events</Anchor>
        </Link>
        <Link passHref href='/events/Endurance' key={1}>
          <Anchor>Endurance</Anchor>
        </Link>
      </Breadcrumbs>
      <Group className='items-center'>
        <Title>Endurance</Title>
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
          { label: 'Results', value: 'results' },
          { label: 'Timer', value: 'timer' },
        ]}
      />
      {view === 'timer' && <Timer mode='efficiency' />}
      {view === 'results' && <EnduranceTable />}
    </Stack>
  );
};

export default Endurance;
