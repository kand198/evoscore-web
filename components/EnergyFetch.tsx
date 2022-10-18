import { Button, Checkbox, Group, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { Activity } from 'tabler-icons-react';
import useEcu from '../lib/EcuContext';
import { getTimeRange } from '../lib/TimeHelpers';
import DateTimeInput from './DateTimeInput';
import FlashChecker from './FlashChecker';

const EnergyFetch = () => {
  const { ecuTeam, ecuState, getEnergyFrames, clearEnergyFrames } = useEcu();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const submitEnergyRequest = () => {
    const startTimestamp = Math.floor(startTime.getTime() / 1000);
    const endTimestamp = Math.floor(endTime.getTime() / 1000);
    console.log(startTimestamp, endTimestamp);
    clearEnergyFrames();
    getEnergyFrames([startTimestamp, endTimestamp]);
  };

  useEffect(() => {
    if (ecuTeam !== undefined) {
      const [startTimeNum, endTimeNum] = getTimeRange(ecuTeam);
      setStartTime(new Date(startTimeNum));
      setEndTime(new Date(endTimeNum));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecuTeam]);

  return (
    <Group className='gap-y-2 gap-x-2 items-end'>
      <DateTimeInput label='From:' value={startTime.getTime()} onChange={(n) => setStartTime(new Date(n))} />
      <DateTimeInput label='To:' value={endTime.getTime()} onChange={(n) => setEndTime(new Date(n))} />
      <Button
        type='submit'
        className='bg-blue-600 hover:bg-blue-800'
        disabled={ecuState !== 'Ready'}
        leftIcon={<Activity />}
        onClick={() => submitEnergyRequest()}
      >
        <Text>Get Energy</Text>
      </Button>
      <FlashChecker />
    </Group>
  );
};

export default EnergyFetch;
