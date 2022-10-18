import { Button, Text } from '@mantine/core';
import { useTimeout } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Bolt, Check, X } from 'tabler-icons-react';
import useEcu from '../lib/EcuContext';

type CheckState = 'Not Checked' | 'Checking' | 'Passed' | 'Failed';

const FlashChecker = () => {
  const { energyFrames, getEnergyFrames, clearEnergyFrames, ecuState } = useEcu();
  const [checkState, setCheckState] = useState<CheckState>('Not Checked');
  const [flashCheckTimestamp, setFlashCheckTimestamp] = useState<number | undefined>(undefined);

  const getLeftIcon = () => {
    switch (checkState) {
      case 'Not Checked':
        return <Bolt />;
      case 'Checking':
        return null;
      case 'Passed':
        return <Check />;
      case 'Failed':
        return <X />;
    }
  };

  const checkFlash = (clear?: boolean) => {
    const now = Date.now();
    if (clear) {
      clearEnergyFrames();
    }
    setCheckState('Checking');
    getEnergyFrames([now / 1000 - 7, now / 1000]);
  };

  const timeout = useTimeout(() => checkFlash(), 3000);

  useEffect(() => {
    if (checkState === 'Checking') {
      if (energyFrames.length > 0) {
        timeout.clear();
        setCheckState('Passed');
      } else {
        timeout.start();
        if (!flashCheckTimestamp) {
          setFlashCheckTimestamp(Date.now());
        }
        if (flashCheckTimestamp < Date.now() - 15000) {
          setCheckState('Failed');
          setFlashCheckTimestamp(undefined);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [energyFrames]);

  useEffect(() => {
    if (ecuState === 'Disconnected') {
      setCheckState('Not Checked');
    }
  }, [ecuState]);

  return (
    <Button
      type='button'
      className='bg-blue-600 hover:bg-blue-800'
      disabled={ecuState !== 'Ready'}
      leftIcon={getLeftIcon()}
      loading={checkState === 'Checking'}
      onClick={() => checkFlash(true)}
    >
      <Text>Check Flash</Text>
    </Button>
  );
};

export default FlashChecker;
