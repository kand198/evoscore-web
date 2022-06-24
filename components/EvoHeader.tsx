import { Burger, Header, MediaQuery, Text, useMantineTheme } from '@mantine/core';
import Head from 'next/head';

const EvoHeader = (props: {
  opened: boolean;
  setOpened: (open: boolean) => void;
}) => {
  const theme = useMantineTheme();
  const { opened, setOpened } = props;
  return (
    <Header height={70} p='md'>
      <Head>
        <title>EVoScore</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size='sm'
            color={theme.colors.gray[6]}
            mr='xl'
          />
        </MediaQuery>
        <Text>EVolocity</Text>
      </div>
    </Header>
  );
};

export default EvoHeader;
