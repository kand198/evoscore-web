import { Anchor, Breadcrumbs, Group, MultiSelect, Select, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import TechnicalReportTable from '../../components/TechnicalReportTable';
import { defaultFilters, Filter } from '../../lib/Filters';

const TechnicalReport = () => {
  const [sort, setSort] = useState('number');
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);

  return (
    <Stack>
      <Breadcrumbs>
        <Link passHref href='/events' key={0}>
          <Anchor>Events</Anchor>
        </Link>
        <Link passHref href='/events/technical-report' key={1}>
          <Anchor>Technical Report</Anchor>
        </Link>
      </Breadcrumbs>
      <Group className='items-center'>
        <Title>Technical Report</Title>
        <Select
          label='Sort By'
          data={[
            { value: 'number', label: 'Race Number' },
            { value: 'score', label: 'Score' },
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
      <TechnicalReportTable sortBy={sort} filters={filters} />
    </Stack>
  );
};

export default TechnicalReport;
