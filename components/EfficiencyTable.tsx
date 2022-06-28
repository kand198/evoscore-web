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
import TimeDisplay from './TimeDisplay';
import TimeInput from './TimeInput';
import { useCompetition } from '../lib/CompetitionProvider';
import EventInterface from '../lib/EventInterface';
import Team, { vehicleClassMap } from '../lib/TeamInterface';

const EfficiencyTable = () => {
  const { teams, updateTeam, laps } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const form = useForm({
    initialValues: {
      energy: '0',
      startTimestamp: '0',
      times: formList([{ time: '0' }]),
    },
  });

  const submitEdit = (values: {
    energy: string;
    startTimestamp: string;
    times: FormList<{ time: string }>;
  }) => {
    const newEnergy = Math.max(parseInt(values.energy) | 0, 0);
    const newStartTimestamp = Math.max(parseInt(values.startTimestamp) | 0, 0);
    const newTimes: number[] = [
      newStartTimestamp,
      ...values.times
        .map((s) => Math.max(parseInt(s.time) | 0, 0))
        .filter((n) => n !== 0),
    ];
    const events: EventInterface = {
      ...editTeam.events,
      efficiency: { energy: newEnergy },
      endurance: { ...editTeam.events.endurance, times: newTimes },
    };
    const newEditTeam = { ...editTeam, events };
    updateTeam(newEditTeam);
    setEditTeam(undefined);
  };

  useEffect(() => {
    if (editTeam) {
      const values = {
        energy: editTeam.events.efficiency.energy.toString(),
        startTimestamp: editTeam.events.endurance.times[0]?.toString() || '0',
        times: formList(
          editTeam.events.endurance.times.slice(1).map((t) => {
            return { time: t.toString() };
          })
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
            {team.events?.endurance.times.length > 0
              ? team.events?.endurance.times.length - 1
              : 0}{' '}
            / {laps}
          </td>
          <td>
            <TimeDisplay
              value={
                team.events?.endurance.times.length > 0
                  ? team.events?.endurance.times[
                      team.events?.endurance.times.length - 1
                    ] - team.events?.endurance.times[0]
                  : 0
              }
            />
          </td>
          <td>
            <TimeDisplay
              value={
                team.events?.endurance.times[0]
                  ? team.events?.endurance.times[0]
                  : 0
              }
            />
          </td>
          {Array.from({ length: laps }, (v, i) => i).map((n) => (
            <td key={n}>
              <TimeDisplay
                value={
                  team.events?.endurance.times.slice(1)[n]
                    ? team.events?.endurance.times.slice(1)[n]
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
            <TimeInput
              required
              label='Start Time'
              // placeholder='Start Timestamp (ms)'
              value={parseInt(form.values.startTimestamp)}
              onChange={(v) =>
                form.setValues({ ...form.values, startTimestamp: v.toString() })
              }
            />
            {form.values.times &&
              form.values.times.map((time, i) => (
                <Group className='flex-nowrap' key={i}>
                  <TimeInput
                    label={'Lap ' + (i + 1).toString()}
                    value={parseInt(form.values.times[i].time)}
                    onChange={(t) =>
                      form.setValues({
                        ...form.values,
                        times: formList(
                          form.values.times.map((s, index) =>
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
                    onClick={() => form.removeListItem('times', i)}
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
              onClick={() => form.addListItem('times', { time: '0' })}
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
