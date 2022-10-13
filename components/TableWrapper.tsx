import { Anchor, Breadcrumbs, Group, MultiSelect, NumberInput, Select, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import React, { useState } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';

const TableWrapper = ({
  children,
  useLaps,
  title,
  breadcrumbs,
}: {
  children: React.ReactNode;
  useLaps?: boolean;
  title: string;
  breadcrumbs: { label: string; href: string }[];
}) => {
  const { laps, setLaps } = useCompetition();
  const [sortBy, setSort] = useState('number');
  const [filters, setFilters] = useState<string[]>([]);

  // const childWithProps = React.cloneElement(children, {
  //   sortBy,
  //   filters,
  // });

  return (
    <Stack>
      <Breadcrumbs>
        {breadcrumbs.map((breadcrumb, index) => (
          <Link passHref href={breadcrumb.href} key={index}>
            <Anchor>{breadcrumb.label}</Anchor>
          </Link>
        ))}
      </Breadcrumbs>
      <Group className='items-center'>
        <Title>{title}</Title>
        if (useLaps) {<NumberInput value={laps} onChange={(val) => setLaps(val)} label='Number of Laps' />}
        <Select
          label='Sort By'
          data={[{ value: 'number', label: 'Race Number' }, useLaps && { value: 'laps', label: 'Number of Laps' }, { value: 'time', label: 'Time' }]}
          defaultValue='number'
          value={sortBy}
          onChange={(val) => setSort(val)}
        />
        <MultiSelect
          label='Filter'
          placeholder='All items'
          value={filters}
          onChange={(val) => setFilters(val)}
          data={[
            {
              value: 'standard',
              label: 'Standard (350W)',
              group: 'Class',
            },
            { value: 'open', label: 'Open (1kW)', group: 'Class' },
            {
              value: 'competition',
              label: 'Competition (3kW)',
              group: 'Class',
            },
            { value: 'bike', label: 'Bike', group: 'Type' },
            { value: 'kart', label: 'Kart', group: 'Type' },
          ]}
          clearButtonLabel='Clear selection'
          clearable
        />
      </Group>
      {children}
    </Stack>
  );
};

export default TableWrapper;
