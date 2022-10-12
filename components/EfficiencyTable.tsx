import { ActionIcon, Button, Group, Modal, NumberInput, ScrollArea, Space, Table, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { Trash } from 'tabler-icons-react';
import LapTimeInput from './LapTimeInput';
import { useCompetition } from '../lib/CompetitionProvider';
import EventInterface from '../lib/EventInterface';
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';
import LapTimeDisplay from './LapTimeDisplay';
import TimeDisplay from './TimeDisplay';
import DateTimeInput from './DateTimeInput';
import { getNumLaps, getTotalTime } from '../lib/TimeHelpers';
import { Filter, teamMeetsFilters } from '../lib/Filters';

const EfficiencyTable = ({ sortBy, filters }: { sortBy?: string; filters?: Filter[] }) => {
  const { teams, updateTeam, laps } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const filteredTeams = teams?.filter((team: Team) => teamMeetsFilters(team, filters));

  const sortedTeams = filteredTeams?.sort((a: Team, b: Team) => {
    if (!sortBy) {
      return 0;
    }
    switch (sortBy) {
      case 'laps':
        return a.events.endurance.lapTimes.length - b.events.endurance.lapTimes.length;
      case 'class':
        return a.class - b.class;
      case 'type':
        return a.type - b.type;
      case 'energy':
        return a.events.efficiency.energy - b.events.efficiency.energy;
      case 'number':
      default:
        return a.id - b.id;
    }
  });

  const form = useForm({
    initialValues: {
      energy: 0,
      startTime: Date.now(),
      lapTimes: [{ time: 0 }],
    },
  });

  const submitEdit = (values: { energy: number; startTime: number; lapTimes: { time: number }[] }) => {
    const newEnergy = Math.max(values.energy, 0);
    const newStartTime = Math.max(values.startTime, 0);
    const newLapTimes: number[] = [...values.lapTimes.map((s) => Math.max(s.time, 0)).filter((n) => n !== 0)];
    const events: EventInterface = {
      ...editTeam.events,
      endurance: {
        ...editTeam.events.endurance,
        startTime: newStartTime,
        lapTimes: newLapTimes,
      },
      efficiency: {
        ...editTeam.events.efficiency,
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
        startTime: editTeam.events.endurance.startTime || Date.now(),
        lapTimes: editTeam.events.endurance.lapTimes.map((lt) => ({
          time: lt,
        })),
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
        <th>Type</th>
        <th>Energy Used</th>
        <th>Laps</th>
      </tr>
    </thead>
  );
  const EfficiencyBody = (
    <tbody>
      {sortedTeams?.map((team, index) => {
        return (
          <tr
            key={team.id}
            className={`hover:cursor-pointer ${getNumLaps(team) >= laps ? 'bg-green-200 hover:bg-green-400/50' : 'bg-red-200 hover:bg-red-400/50'}`}
            onClick={() => setEditTeam(team)}
          >
            <td>{team.id}</td>
            <td>{team.name}</td>
            <td>{team.school}</td>
            <td>{vehicleClassMap.get(team.class)}</td>
            <td>{vehicleTypeMap.get(team.type)}</td>
            <td>{team.events?.efficiency.energy}</td>
            <td>
              {getNumLaps(team)} / {laps}
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  return (
    <>
      <ScrollArea className='relative'>
        <Table className='overflow-x-scroll whitespace-nowrap'>
          {EfficiencyHeader}
          {EfficiencyBody}
        </Table>
        <Space h='md' />
      </ScrollArea>
      <Modal
        opened={editTeam !== undefined}
        onClose={() => setEditTeam(undefined)}
        title={
          <Title order={3}>
            {editTeam?.number ? '#' + editTeam?.number + ' ' : ''}
            {editTeam?.name}
          </Title>
        }
      >
        <form onSubmit={form.onSubmit((values) => submitEdit(values))}>
          <ScrollArea>
            <NumberInput
              required
              label='Energy Used'
              placeholder='Energy Used (mWh)'
              value={form.values.energy}
              onChange={(e) => form.setValues({ ...form.values, energy: e })}
              width='w-full'
            />
          </ScrollArea>
          <Space h='md' />
          <Group className='justify-evenly'>
            <Button type='submit' className='bg-blue-600 hover:bg-blue-800'>
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default EfficiencyTable;
