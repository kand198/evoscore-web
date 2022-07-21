import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  ScrollArea,
  Space,
  Table,
} from '@mantine/core';
import { useForm, formList, FormList } from '@mantine/form';
import { useEffect, useState } from 'react';
import { Trash } from 'tabler-icons-react';
import LapTimeInput from './LapTimeInput';
import { useCompetition } from '../lib/CompetitionProvider';
import EventInterface from '../lib/EventInterface';
import Team, { vehicleClassMap } from '../lib/TeamInterface';
import LapTimeDisplay from './LapTimeDisplay';
import TimeDisplay from './TimeDisplay';
import DateTimeInput from './DateTimeInput';

const EfficiencyTable = () => {
  const { teams, updateTeam, laps } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const form = useForm({
    initialValues: {
      energy: '0',
      startTime: '0',
      lapTimes: formList([{ time: '0' }]),
    },
  });

  const submitEdit = (values: {
    energy: string;
    startTime: string;
    lapTimes: FormList<{ time: string }>;
  }) => {
    console.log(values);
    const newEnergy = Math.max(parseInt(values.energy) | 0, 0);
    const newStartTime = Math.max(parseInt(values.startTime) | 0, 0);
    const newLapTimes: number[] = [
      ...values.lapTimes
        .map((s) => Math.max(parseInt(s.time) | 0, 0))
        .filter((n) => n !== 0),
    ];
    const events: EventInterface = {
      ...editTeam.events,
      efficiency: {
        ...editTeam.events.efficiency,
        startTime: newStartTime,
        lapTimes: newLapTimes,
        energy: newEnergy,
      },
    };
    console.log(events);
    const newEditTeam = { ...editTeam, events };
    updateTeam(newEditTeam);
    setEditTeam(undefined);
  };

  useEffect(() => {
    if (editTeam) {
      const values = {
        energy: editTeam.events.efficiency.energy.toString(),
        startTime: editTeam.events.efficiency.startTime.toString() || '0',
        lapTimes: formList(
          editTeam.events.efficiency.lapTimes.map((lt) => ({
            time: lt.toString(),
          }))
        ),
      };
      form.setValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTeam]);

  const EfficiencyHeader = (
    <thead>
      <tr>
        <th>ID #</th>
        <th>Name</th>
        <th>School</th>
        <th>Class</th>
        <th>Energy Used</th>
        <th>Laps</th>
        <th>Total Time</th>
        <th>Start Time</th>
        {Array.from({ length: laps }, (v, i) => i).map((n) => (
          <th key={n}>Lap {n + 1}</th>
        ))}
      </tr>
    </thead>
  );
  const EfficiencyBody = (
    <tbody>
      {teams?.map((team) => (
        <tr
          key={team.id}
          className='hover:cursor-pointer'
          onClick={() => setEditTeam(team)}
        >
          <td>{team.id}</td>
          <td>{team.name}</td>
          <td>{team.school}</td>
          <td>{vehicleClassMap.get(team.class)}</td>
          <td>{team.events?.efficiency.energy}</td>
          <td>
            {team.events?.efficiency.lapTimes.length > 0
              ? team.events?.efficiency.lapTimes.length - 1
              : 0}{' '}
            / {laps}
          </td>
          <td>
            <TimeDisplay value={team.events.efficiency.startTime || 0} />
          </td>
          <td>
            <LapTimeDisplay value={team.events?.efficiency.lapTimes[0] || 0} />
          </td>
          {Array.from({ length: laps }, (v, i) => i).map((n) => (
            <td key={n}>
              <LapTimeDisplay
                value={
                  team.events?.efficiency.lapTimes.slice(1)[n]
                    ? team.events?.efficiency.lapTimes.slice(1)[n]
                    : 0
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <>
      <ScrollArea className='relative'>
        <Table
          highlightOnHover
          className='overflow-x-scroll whitespace-nowrap'
          striped
        >
          {EfficiencyHeader}
          {EfficiencyBody}
        </Table>
        <Space h='md' />
      </ScrollArea>
      <Modal
        opened={editTeam !== undefined}
        onClose={() => setEditTeam(undefined)}
        title='Edit Team Details'
      >
        <form onSubmit={form.onSubmit((values) => submitEdit(values))}>
          <ScrollArea>
            <NumberInput
              required
              label='Energy Used'
              placeholder='Energy Used (mWh)'
              value={parseInt(form.values.energy)}
              onChange={(e) =>
                form.setValues({ ...form.values, energy: e.toString() })
              }
            />
            <DateTimeInput
              required
              label='Start Time'
              value={parseInt(form.values.startTime)}
              onChange={(v) =>
                form.setValues({ ...form.values, startTime: v.toString() })
              }
            />
            {form.values.lapTimes &&
              form.values.lapTimes.map((time, i) => (
                <Group className='flex-nowrap' key={i}>
                  <LapTimeInput
                    label={'Lap ' + (i + 1).toString()}
                    value={parseInt(form.values.lapTimes[i].time)}
                    onChange={(t) =>
                      form.setValues({
                        ...form.values,
                        lapTimes: formList(
                          form.values.lapTimes.map((s, index) =>
                            i === index ? { time: t.toString() } : s
                          )
                        ),
                      })
                    }
                  />
                  <ActionIcon
                    color='red'
                    variant='hover'
                    className='self-end mb-1'
                    onClick={() => form.removeListItem('lapTimes', i)}
                  >
                    <Trash size={16} />
                  </ActionIcon>
                </Group>
              ))}
          </ScrollArea>
          <Space h='md' />
          <Group className='justify-evenly'>
            <Button type='submit' className='bg-blue-600 hover:bg-blue-800'>
              Submit
            </Button>
            <Button
              className='bg-blue-600 hover:bg-blue-800'
              onClick={() => form.addListItem('lapTimes', { time: '0' })}
            >
              Add Time
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default EfficiencyTable;
