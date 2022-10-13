import { Button, Group, Stack, Table, Modal, Title, TextInput, Space, Select, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { Plus } from 'tabler-icons-react';
import { useCompetition } from '../lib/CompetitionProvider';
import { VehicleClass } from '../lib/proto/evolocity';
import Team, { emptyTeam, vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';

const Teams = () => {
  const { teams, addTeam, removeTeam, updateTeam } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const form = useForm({
    initialValues: {
      number: 0,
      name: '',
      school: '',
      class: vehicleClassMap.get(VehicleClass.STANDARD),
      type: null,
    },
  });

  const handleAddTeamClick = () => {
    setEditTeam({ ...emptyTeam(), id: teams.map((t) => t.id).reduce((maxId, id) => Math.max(maxId, id), -1) + 1 } as Team);
  };

  const submitEdit = (values: { number: number; school: string; class: string; name: string; type: string }) => {
    const { number, school, name } = values;
    const vehicleClass = parseInt(values.class);
    const vehicleType = parseInt(values.type);
    const newEditTeam = {
      ...editTeam,
      number,
      school,
      name,
      class: vehicleClass,
      type: vehicleType,
    };
    console.log(newEditTeam);
    updateTeam(newEditTeam);
    setEditTeam(undefined);
  };

  const deleteEditTeam = () => {
    removeTeam(editTeam);
    setEditTeam(undefined);
  };

  const exitEdit = () => {
    if (!editTeam || (editTeam.name === '' && editTeam.school === '')) {
      removeTeam(editTeam);
    }
    setEditTeam(undefined);
  };

  useEffect(() => {
    if (editTeam) {
      form.setValues({
        number: editTeam.number !== -1 ? editTeam.number : null,
        name: editTeam.name ?? '',
        school: editTeam.school ?? '',
        class: editTeam.class?.toString() ?? '',
        type: editTeam.type?.toString() ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTeam]);

  const teamHeader = (
    <thead>
      <tr>
        <th>Team #</th>
        <th>Name</th>
        <th>School</th>
        <th>Class</th>
        <th>Type</th>
      </tr>
    </thead>
  );
  const teamBody = (
    <tbody>
      {teams?.map((team) => (
        <tr key={team.id} className='hover:cursor-pointer' onClick={() => setEditTeam(team)}>
          <td>{team.number}</td>
          <td>{team.name}</td>
          <td>{team.school}</td>
          <td>{vehicleClassMap.get(team.class)}</td>
          <td>{vehicleTypeMap.get(team.type)}</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <Stack>
      <Group className='items-center'>
        <Title>Teams</Title>
        <Button leftIcon={<Plus />} onClick={handleAddTeamClick} className='bg-blue-600 hover:bg-blue-800'>
          Add Team
        </Button>
      </Group>
      <Table striped highlightOnHover>
        {teamHeader}
        {teamBody}
      </Table>
      <Modal opened={editTeam !== undefined} onClose={() => exitEdit()} title='Edit Team Details'>
        <form onSubmit={form.onSubmit((values) => submitEdit(values))}>
          <NumberInput required label='Team Number' placeholder='Number' {...form.getInputProps('number')} />
          <TextInput required label='Team Name' placeholder='Name' {...form.getInputProps('name')} />
          <TextInput required label='School' placeholder='School' {...form.getInputProps('school')} />
          <Select
            required
            label='Select the Vehicle Class'
            placeholder='Pick one'
            data={[
              { value: '0', label: 'Standard' },
              { value: '1', label: 'Open' },
              { value: '2', label: 'Competition' },
            ]}
            {...form.getInputProps('class')}
          />
          <Select
            required
            label='Select the Vehicle Type'
            placeholder='Pick one'
            data={[
              { value: '0', label: 'Bike' },
              { value: '1', label: 'Kart' },
            ]}
            {...form.getInputProps('type')}
          />
          <Space h='md' />
          <Group className='justify-evenly'>
            <Button type='submit' className='bg-blue-600 hover:bg-blue-800'>
              Submit
            </Button>
            <Button type='button' className='bg-red-600 hover:bg-red-800' onClick={() => deleteEditTeam()}>
              Delete
            </Button>
          </Group>
        </form>
      </Modal>
    </Stack>
  );
};

export default Teams;
