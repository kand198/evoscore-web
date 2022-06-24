import { Button, Navbar, Text } from '@mantine/core';
import Link from 'next/link';
import pages from '../lib/pages';

const EvoNavbar = (props: { opened: boolean }) => {
  const { opened } = props;
  return (
    <Navbar
      p='md'
      hiddenBreakpoint='sm'
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
      className='p-0'
    >
      {pages.map((page) => <Link key={page.name} href={page.path} passHref><Button className='bg-none text-black hover:text-white rounded-none hover:bg-blue-800 w-full'>{page.name}</Button></Link>)}
    </Navbar>
  );
};

export default EvoNavbar;
