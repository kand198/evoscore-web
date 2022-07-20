import { Button, Checkbox, Text } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useEffect } from 'react';
import { Activity } from 'tabler-icons-react';
import useEcu from '../lib/EcuContext';
import { getTimeRange } from '../lib/TimeHelpers';
import DateTimeInput from './DateTimeInput';

const EnergyFetch = () => {
  const { ecuTeam, ecuState, getEnergyFrames, clearEnergyFrames } = useEcu();

  const timeForm = useForm({
    initialValues: {
      startTime: Date.now().toString(),
      endTime: Date.now().toString(),
    },
  });

  const submitEnergyRequest = (values: {
    startTime: string;
    endTime: string;
  }) => {
    const { startTime, endTime } = values;
    const startTimeDate = new Date(parseInt(startTime));
    const endTimeDate = new Date(parseInt(endTime));
    const startTimestamp = Math.floor(startTimeDate.getTime() / 1000);
    const endTimestamp = Math.floor(endTimeDate.getTime() / 1000);
    console.log(startTimestamp, endTimestamp);
    clearEnergyFrames();
    getEnergyFrames([startTimestamp, endTimestamp]);
  };

  useEffect(() => {
    if (ecuTeam !== undefined) {
      const [startTimeNum, endTimeNum] = getTimeRange(ecuTeam);
      timeForm.setValues({
        startTime: startTimeNum.toString(),
        endTime: endTimeNum.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecuTeam]);

  return (
    <form
      onSubmit={timeForm.onSubmit((values) => submitEnergyRequest(values))}
      className='w-full flex flex-row gap-x-2 items-end'
    >
      <DateTimeInput
        label='From:'
        value={parseInt(timeForm.values.startTime)}
        onChange={(v) => {
          console.log(v);
          timeForm.setValues({ ...timeForm.values, startTime: v.toString() });
        }}
      />
      <DateTimeInput
        label='To:'
        value={parseInt(timeForm.values.endTime)}
        onChange={(v) =>
          timeForm.setValues({ ...timeForm.values, endTime: v.toString() })
        }
      />
      <Button
        type='submit'
        className='bg-blue-600 hover:bg-blue-800'
        disabled={ecuState !== 'Ready'}
        leftIcon={<Activity />}
      >
        <Text>Get Energy</Text>
      </Button>
    </form>
  );
};

export default EnergyFetch;
