import { Anchor, Breadcrumbs, Group, MultiSelect, Select, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import EfficiencyTable from '../../components/EfficiencyTable';
import { defaultFilters, Filter } from '../../lib/Filters';

const Efficiency = () => {
  const [sort, setSort] = useState('number');
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);

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
        <Select
          label='Sort By'
          data={[
            { value: 'number', label: 'Race Number' },
            { value: 'laps', label: 'Number of Laps' },
            { value: 'energy', label: 'Energy' },
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
      <EfficiencyTable sortBy={sort} filters={filters} />
    </Stack>
  );
};

export default Efficiency;
