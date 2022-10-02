import { Anchor, Breadcrumbs, Group, MultiSelect, Select, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import DragTable from '../../components/DragTable';
import { defaultFilters, Filter } from '../../lib/Filters';

const Drag = () => {
  const [sort, setSort] = useState('number');
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);

  return (
    <Stack>
      <Breadcrumbs>
        <Link passHref href='/events' key={0}>
          <Anchor>Events</Anchor>
        </Link>
        <Link passHref href='/events/drag' key={1}>
          <Anchor>Drag</Anchor>
        </Link>
      </Breadcrumbs>
      <Group className='items-center'>
        <Title>Drag</Title>
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
          data={filters}
          clearButtonLabel='Clear selection'
          clearable
        />
      </Group>
      <DragTable sortBy={sort} filters={filters} />
    </Stack>
  );
};

export default Drag;
