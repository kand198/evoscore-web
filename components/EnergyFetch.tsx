import { Button, NumberInput, Select, SelectItem } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useEffect } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';
import useEcu from '../lib/EcuContext';
import { getTimeRange } from '../lib/TimeHelpers';
import TimeInput from './TimeInput';

const EnergyFetch = () => {
  const { ecuTeam, ecuState } = useEcu();

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
    const todayTimestamp = new Date(Date.now()).setHours(0, 0, 0, 0);
    const startTimestamp = Math.floor((todayTimestamp + parseInt(startTime))/1000);
    const endTimestamp = Math.floor((todayTimestamp + parseInt(endTime))/1000);
    const nowTimestamp = Math.floor(Date.now()/1000);
    console.log(startTimestamp, endTimestamp, todayTimestamp);
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
      <TimeInput
        label='Select the start time'
        value={parseInt(timeForm.values.startTime)}
        onChange={(v) =>
          timeForm.setValues({ ...timeForm.values, startTime: v.toString() })
        }
      />
      <TimeInput
        label='Select the end time'
        value={parseInt(timeForm.values.endTime)}
        onChange={(v) =>
          timeForm.setValues({ ...timeForm.values, endTime: v.toString() })
        }
      />
      <Button
        type='submit'
        className='bg-blue-600 hover:bg-blue-800 max-w-sm'
        disabled={ecuState !== 'Ready'}
      >
        Submit
      </Button>
    </form>
  );
};

export default EnergyFetch;
