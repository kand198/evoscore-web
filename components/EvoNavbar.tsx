import { Button, Navbar } from '@mantine/core';
import Link from 'next/link';
import pages from '../lib/pages';

interface IEvoNavbarProps {opened: boolean, onClose: () => void};

const EvoNavbar = ({opened, onClose}: IEvoNavbarProps) => {
  return (
    <Navbar
      p='md'
      hiddenBreakpoint='sm'
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
      className='p-0'
    >
      {pages.map((page) => (
        <Link key={page.name} href={page.path} passHref>
          <Button onClick={onClose} className='bg-none text-black hover:text-white rounded-none hover:bg-blue-800 w-full'>
            {page.name}
          </Button>
        </Link>
      ))}
    </Navbar>
  );
};

export default EvoNavbar;
