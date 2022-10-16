import { Anchor, Breadcrumbs, Group, MultiSelect, NumberInput, Select, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import EnduranceTable from '../../components/EnduranceTable';
import { useCompetition } from '../../lib/CompetitionProvider';
import { defaultFilters, Filter } from '../../lib/Filters';

const Endurance = () => {
  const { laps, setLaps } = useCompetition();
  const [sort, setSort] = useState('time');
  const [filters, setFilters] = useState<Filter[]>([...defaultFilters]);

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
        {/* <NumberInput value={laps} onChange={(val) => setLaps(val)} label='Number of Laps' /> */}
        <Select
          label='Sort By'
          data={[
            { value: 'number', label: 'Race Number' },
            { value: 'laps', label: 'Number of Laps' },
            { value: 'time', label: 'Time' },
          ]}
          defaultValue='number'
          value={sort}
          onChange={(val) => setSort(val)}
        />
        <MultiSelect
          label='Filter'
          placeholder='All items'
          value={filters.filter((f) => f.active).map((filter) => filter.value)}
          onChange={(val) => setFilters(filters.map((filter) => (val.includes(filter.value) ? { ...filter, active: true } : { ...filter, active: false })))}
          data={filters.map(({ value, label }) => ({ value, label }))}
          clearButtonLabel='Clear selection'
          clearable
        />
      </Group>
      <EnduranceTable sortBy={sort} filters={filters} />
    </Stack>
  );
};

export default Endurance;
