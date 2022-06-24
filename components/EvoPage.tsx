import React, { Children, useState } from 'react';
import {
  AppShell,
  Footer,
  useMantineTheme,
} from '@mantine/core';
import EvoHeader from './EvoHeader';
import EvoNavbar from './EvoNavbar';

type Props = {
  children?: React.ReactNode
};

const EvoPage = (props) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { children } = props;
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<EvoNavbar opened={opened} />}
      footer={
        <Footer height={60} p="md">
          Copyright EVolocity. Created by Keith Anderson and Thomas Galbraith.
        </Footer>
      }
      header={<EvoHeader opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  );
};

export default EvoPage;