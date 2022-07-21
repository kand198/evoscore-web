import React, { Children, useState } from 'react';
import { AppShell, Footer, useMantineTheme } from '@mantine/core';
import EvoHeader from './EvoHeader';
import EvoNavbar from './EvoNavbar';
import AppNotifications from './AppNotifications';

type Props = {
  children?: React.ReactNode;
};

const EvoPage = (props) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { children } = props;
  return (
    <>
      <AppNotifications />
      <AppShell
        classNames={{
          main: 'overflow-hidden bg-gray-50',
        }}
        navbarOffsetBreakpoint='sm'
        asideOffsetBreakpoint='sm'
        fixed
        navbar={<EvoNavbar opened={opened} onClose={() => setOpened(false)} />}
        footer={
          <Footer height={60} p='md'>
            Copyright EVolocity. Created by Keith Anderson and Thomas Galbraith.
          </Footer>
        }
        header={<EvoHeader opened={opened} setOpened={setOpened} />}
      >
        {children}
      </AppShell>
    </>
  );
};

export default EvoPage;
