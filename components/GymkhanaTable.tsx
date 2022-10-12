import { ActionIcon, Button, Group, Modal, NumberInput, ScrollArea, Space, Stack, Table, Input, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';
import EventInterface from '../lib/EventInterface';
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';
import { Filter, teamMeetsFilters } from '../lib/Filters';
import LapTimeInput from './LapTimeInput';
import { Trash } from 'tabler-icons-react';
import LapTimeDisplay from './LapTimeDisplay';

export const getGymkhanaTimeFromRun = ({ time, cones, bonus, loss }: { time: number; cones: number; bonus: number; loss: number }) => {
  return time + 1000 * (cones * 5 + loss * 5 - bonus * 10);
};

const GymkhanaTable = ({ sortBy, filters }: { sortBy?: string; filters?: Filter[] }) => {
  const { teams, updateTeam } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const filteredTeams = teams?.filter((team: Team) => teamMeetsFilters(team, filters));

  const sortedTeams = filteredTeams?.sort((a: Team, b: Team) => {
    if (!sortBy) {
      return 0;
    }
    switch (sortBy) {
      case 'time':
        if (a.events.gymkhana.runs.length === 0 && b.events.gymkhana.runs.length === 0) {
          return 0;
        }
        if (a.events.gymkhana.runs.length === 0) {
          return 1;
        }
        if (b.events.gymkhana.runs.length === 0) {
          return -1;
        }
        return (
          Math.min(...a.events.gymkhana.runs.map((r) => getGymkhanaTimeFromRun(r))) - Math.min(...b.events.gymkhana.runs.map((r) => getGymkhanaTimeFromRun(r)))
        );
      case 'number':
      default:
        return a.number - b.number;
    }
  });

  const form = useForm({
    initialValues: {
      runs: [{ time: 0, cones: 0, bonus: 0, loss: 0 }],
    },
  });

  const submitEdit = (values: { runs: { time: number; cones: number; bonus: number; loss: number }[] }) => {
    const newRuns = [
      ...values.runs
        .map(({ time, cones, bonus, loss }) => ({
          time: Math.max(time, 0),
          cones: Math.max(cones, 0),
          bonus: Math.max(bonus, 0),
          loss: Math.max(loss, 0),
        }))
        .filter(({ time, cones, bonus, loss }) => time !== 0 || cones !== 0 || bonus !== 0 || loss !== 0),
    ];
    const events: EventInterface = {
      ...editTeam.events,
      gymkhana: {
        ...editTeam.events.gymkhana,
        runs: newRuns,
      },
    };
    const newEditTeam = { ...editTeam, events };
    updateTeam(newEditTeam);
    setEditTeam(undefined);
  };

  useEffect(() => {
    if (editTeam) {
      const values = {
        runs: editTeam.events.gymkhana?.runs ? editTeam.events.gymkhana.runs : [],
      };
      form.setValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTeam]);

  const GymkhanaHeader = (
    <thead>
      <tr>
        <th>Race #</th>
        <th>Name</th>
        <th>School</th>
        <th>Class</th>
        <th>Type</th>
        {Array.from({ length: 5 }, (_, i) => i).map((i) => (
          <th key={i}>Run {i + 1}</th>
        ))}
      </tr>
    </thead>
  );
  const GymkhanaBody = (
    <tbody>
      {sortedTeams?.map((team) => {
        const runs = team.events.gymkhana?.runs ? team.events.gymkhana.runs : [];
        return (
          <tr key={team.id} className='hover:cursor-pointer hover:bg-gray-200' onClick={() => setEditTeam(team)}>
            <td>{team.number}</td>
            <td>{team.name}</td>
            <td>{team.school}</td>
            <td>{vehicleClassMap.get(team.class)}</td>
            <td>{vehicleTypeMap.get(team.type)}</td>
            <td>{<LapTimeDisplay value={runs[0] && getGymkhanaTimeFromRun(runs[0])} />}</td>
            <td>{<LapTimeDisplay value={runs[1] && getGymkhanaTimeFromRun(runs[1])} />}</td>
            <td>{<LapTimeDisplay value={runs[2] && getGymkhanaTimeFromRun(runs[2])} />}</td>
            <td>{<LapTimeDisplay value={runs[3] && getGymkhanaTimeFromRun(runs[3])} />}</td>
            <td>{<LapTimeDisplay value={runs[4] && getGymkhanaTimeFromRun(runs[4])} />}</td>
          </tr>
        );
      })}
    </tbody>
  );

  return (
    <>
      <ScrollArea className='relative'>
        <Table className='overflow-x-scroll whitespace-nowrap'>
          {GymkhanaHeader}
          {GymkhanaBody}
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
            {form.values.runs &&
              form.values.runs.map((run, i) => (
                <Input.Wrapper label={`Run ${i + 1}`} className='mb-4' required key={i}>
                  <Group className='flex-nowrap'>
                    <Stack>
                      <LapTimeInput
                        label='Time'
                        value={form.values.runs[i].time}
                        onChange={(t) =>
                          form.setFieldValue(
                            'runs',
                            form.values.runs.map((r, j) => (j === i ? { ...r, time: t } : r))
                          )
                        }
                      />
                      <NumberInput
                        label='Cones'
                        value={form.values.runs[i].cones}
                        onChange={(c) =>
                          form.setFieldValue(
                            'runs',
                            form.values.runs.map((r, j) => (j === i ? { ...r, cones: c } : r))
                          )
                        }
                      />
                      <NumberInput
                        label='Bonus'
                        value={form.values.runs[i].bonus}
                        onChange={(b) =>
                          form.setFieldValue(
                            'runs',
                            form.values.runs.map((r, j) => (j === i ? { ...r, bonus: b } : r))
                          )
                        }
                      />
                      <NumberInput
                        label='Loss'
                        value={form.values.runs[i].loss}
                        onChange={(l) =>
                          form.setFieldValue(
                            'runs',
                            form.values.runs.map((r, j) => (j === i ? { ...r, loss: l } : r))
                          )
                        }
                      />
                    </Stack>
                    <ActionIcon color='red' variant='subtle' className='mb-1' onClick={() => form.removeListItem('runs', i)}>
                      <Trash size={16} />
                    </ActionIcon>
                  </Group>
                </Input.Wrapper>
              ))}
          </ScrollArea>
          <Space h='md' />
          <Group className='justify-evenly'>
            <Button type='submit' className='bg-blue-600 hover:bg-blue-800'>
              Submit
            </Button>
            <Button
              className='bg-blue-600 hover:bg-blue-800'
              onClick={() => form.insertListItem('runs', { time: 0, cones: 0, bonus: 0, loss: 0 })}
              disabled={form.values.runs?.length >= 5}
            >
              Add Time
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default GymkhanaTable;
