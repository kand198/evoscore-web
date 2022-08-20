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
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';
import LapTimeDisplay from './LapTimeDisplay';
import TimeDisplay from './TimeDisplay';
import DateTimeInput from './DateTimeInput';
import { getTotalTime } from '../lib/TimeHelpers';

const EnduranceTable = () => {
  const { teams, updateTeam, laps } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const form = useForm({
    initialValues: {
      energy: 0,
      startTime: Date.now(),
      lapTimes: formList([{ time: 0 }]),
    },
  });

  const submitEdit = (values: {
    energy: number;
    startTime: number;
    lapTimes: FormList<{ time: number }>;
  }) => {
    console.log(values);
    const newEnergy = Math.max(values.energy, 0);
    const newStartTime = Math.max(values.startTime, 0);
    const newLapTimes: number[] = [
      ...values.lapTimes.map((s) => Math.max(s.time, 0)).filter((n) => n !== 0),
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
        energy: editTeam.events.efficiency.energy,
        startTime: editTeam.events.efficiency.startTime || Date.now(),
        lapTimes: formList(
          editTeam.events.efficiency.lapTimes.map((lt) => ({
            time: lt,
          }))
        ),
      };
      form.setValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTeam]);

  const EnduranceHeader = (
    <thead>
      <tr>
        <th>ID #</th>
        <th>Name</th>
        <th>School</th>
        <th>Class</th>
        <th>Type</th>
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
  const EnduranceBody = (
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
          <td>{vehicleTypeMap.get(team.type)}</td>
          <td>{team.events?.efficiency.energy}</td>
          <td>
            {team.events?.efficiency.lapTimes.length > 0
              ? team.events?.efficiency.lapTimes.length
              : 0}{' '}
            / {laps}
          </td>
          <td>
            <LapTimeDisplay value={getTotalTime(team)} />
          </td>
          <td>
            <TimeDisplay value={team.events.efficiency.startTime || 0} />
          </td>
          <td>
            <LapTimeDisplay value={team.events?.efficiency.lapTimes[0] || 0} />
          </td>
          {Array.from({ length: laps - 1 }, (v, i) => i).map((n) => (
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
          {EnduranceHeader}
          {EnduranceBody}
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
              value={form.values.energy}
              onChange={(e) => form.setValues({ ...form.values, energy: e })}
            />
            <DateTimeInput
              required
              label='Start Time'
              value={form.values.startTime}
              onChange={(v) => form.setValues({ ...form.values, startTime: v })}
            />
            {form.values.lapTimes &&
              form.values.lapTimes.map((time, i) => (
                <Group className='flex-nowrap' key={i}>
                  <LapTimeInput
                    label={'Lap ' + (i + 1).toString()}
                    value={form.values.lapTimes[i].time}
                    onChange={(t) =>
                      form.setValues({
                        ...form.values,
                        lapTimes: formList(
                          form.values.lapTimes.map((s, index) =>
                            i === index ? { time: t } : s
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
              onClick={() => form.addListItem('lapTimes', { time: 0 })}
            >
              Add Time
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default EnduranceTable;
