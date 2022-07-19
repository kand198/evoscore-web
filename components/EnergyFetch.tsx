import { Button,Text } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useEffect } from 'react';
import { Activity } from 'tabler-icons-react';
import useEcu from '../lib/EcuContext';
import { getTimeRange } from '../lib/TimeHelpers';
import TimeInput from './TimeInput';

const EnergyFetch = () => {
  const { ecuTeam, ecuState, getEnergy } = useEcu();

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
    const startTimestamp = Math.floor(
      (todayTimestamp + parseInt(startTime)) / 1000
    );
    const endTimestamp = Math.floor(
      (todayTimestamp + parseInt(endTime)) / 1000
    );
    console.log(startTimestamp, endTimestamp, Date.now() / 1000);
    getEnergy([startTimestamp, endTimestamp])
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
