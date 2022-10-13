import { Anchor, Card, Group, MultiSelect, Select, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import { defaultFilters, Filter } from '../lib/Filters';
import { events } from '../lib/pages';

const Events = () => {
  const [sort, setSort] = useState('number');
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);

  return (
    <Stack>
      <Title>Events</Title>
      <Group>
        {events
          ?.filter(({ name }) => name !== 'Technical Report')
          .map((e, i) => (
            <Link passHref href={e.path} key={i}>
              <Card shadow='sm' p='xl' radius='sm' component='a' className='hover:shadow-xl hover:cursor-pointer hover:scale-105 transition'>
                <Title order={3}>{e.name}</Title>
              </Card>
            </Link>
          ))}
      </Group>
      <Group>
        <Title order={2}>Leaderboard</Title>
        <Select
          label='Sort By'
          data={[
            { value: 'number', label: 'Race Number' },
            { value: 'points', label: 'Most Points' },
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
      <LeaderboardTable sortBy={sort} filters={filters} hideTechnicalReport />
    </Stack>
  );
};

export default Events;
