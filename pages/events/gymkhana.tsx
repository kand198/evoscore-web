import { Anchor, Breadcrumbs, Group, MultiSelect, Select, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import GymkhanaTable from '../../components/GymkhanaTable';
import { defaultFilters, Filter } from '../../lib/Filters';

const Gymkhana = () => {
  const [sort, setSort] = useState('time');
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);

  return (
    <Stack>
      <Breadcrumbs>
        <Link passHref href='/events' key={0}>
          <Anchor>Events</Anchor>
        </Link>
        <Link passHref href='' key={1}>
          <Anchor>Gymkhana</Anchor>
        </Link>
      </Breadcrumbs>
      <Group className='items-center'>
        <Title>Gymkhana</Title>
        <Select
          label='Sort By'
          data={[
            { value: 'number', label: 'Race Number' },
            { value: 'time', label: 'Quickest Time' },
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
        <Text italic>Note: Times displayed include deductions and bonuses</Text>
      </Group>
      <GymkhanaTable sortBy={sort} filters={filters} />
    </Stack>
  );
};

export default Gymkhana;
