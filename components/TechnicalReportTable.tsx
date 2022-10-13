import { ActionIcon, Button, Group, Modal, NumberInput, ScrollArea, Space, Table, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';
import EventInterface from '../lib/EventInterface';
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';
import { Filter, teamMeetsFilters } from '../lib/Filters';
import LapTimeInput from './LapTimeInput';
import { Trash } from 'tabler-icons-react';
import LapTimeDisplay from './LapTimeDisplay';

const TechnicalReportTable = ({ sortBy, filters }: { sortBy?: string; filters?: Filter[] }) => {
  const { teams, updateTeam } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const filteredTeams = teams?.filter((team: Team) => teamMeetsFilters(team, filters));

  const sortedTeams = filteredTeams?.sort((a: Team, b: Team) => {
    if (!sortBy) {
      return 0;
    }
    switch (sortBy) {
      case 'score':
        return Math.min(b.events.technicalReport) - Math.min(a.events.technicalReport);
      case 'number':
      default:
        return a.number - b.number;
    }
  });

  const form = useForm({
    initialValues: {
      score: 0,
    },
  });

  const submitEdit = (values: { score: number }) => {
    const events: EventInterface = {
      ...editTeam.events,
      technicalReport: values.score ?? 0,
    };
    const newEditTeam = { ...editTeam, events };
    updateTeam(newEditTeam);
    setEditTeam(undefined);
  };

  useEffect(() => {
    if (editTeam) {
      const values = {
        score: editTeam.events.technicalReport,
      };
      form.setValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTeam]);

  const TechnicalReportHeader = (
    <thead>
      <tr>
        <th>Race #</th>
        <th>Name</th>
        <th>School</th>
        <th>Class</th>
        <th>Type</th>
        <th>Score</th>
      </tr>
    </thead>
  );
  const TechnicalReportBody = (
    <tbody>
      {sortedTeams?.map((team) => {
        return (
          <tr key={team.id} className='hover:cursor-pointer hover:bg-gray-200' onClick={() => setEditTeam(team)}>
            <td>{team.number}</td>
            <td>{team.name}</td>
            <td>{team.school}</td>
            <td>{vehicleClassMap.get(team.class)}</td>
            <td>{vehicleTypeMap.get(team.type)}</td>
            <td>{team.events.technicalReport}</td>
          </tr>
        );
      })}
    </tbody>
  );

  return (
    <>
      <ScrollArea className='relative'>
        <Table className='overflow-x-scroll whitespace-nowrap'>
          {TechnicalReportHeader}
          {TechnicalReportBody}
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
            <NumberInput label='Score' value={form.values.score} onChange={(s) => form.setValues({ score: s ?? 0 })} min={0} max={20} required />
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

export default TechnicalReportTable;
