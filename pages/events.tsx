import { Anchor, Group, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { events } from '../lib/pages';

const Events = () => {
  return (
    <Stack>
      <Title>Events</Title>
      <Group>
        {events?.map((e, i) => (
          <Anchor key={i} href={e.path}>
            {e.name}
          </Anchor>
        ))}
      </Group>
    </Stack>
  );
};

export default Events;
