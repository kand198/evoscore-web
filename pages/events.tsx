import { Anchor, Group, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { events } from '../lib/pages';

const Events = () => {
  return (
    <Stack>
      <Title>Events</Title>
      <Group>
        {events?.map((e, i) => (
          <Link passHref href={e.path} key={i}>
            <Anchor href={e.path}>
              {e.name}
            </Anchor>
          </Link>
        ))}
      </Group>
    </Stack>
  );
};

export default Events;
