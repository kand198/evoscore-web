import {
  Button,
  Group,
  Stack,
  Table,
  Modal,
  Title,
  TextInput,
  Space,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Plus } from 'tabler-icons-react';
import { useCompetition } from '../lib/CompetitionProvider';
import { VehicleClass } from '../lib/proto/evolocity';
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';

const Teams = () => {
  const { teams, addTeam, removeTeam, updateTeam } = useCompetition();
  const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

  const form = useForm({
    initialValues: {
      name: '',
      school: '',
      class: vehicleClassMap.get(VehicleClass.STANDARD),
      type: undefined,
    },
  });

  const handleAddTeamClick = () => {
    setEditTeam({ ...addTeam() });
  };

  const submitEdit = (values: {
    school: string;
    class: string;
    name: string;
    type: string;
  }) => {
    const { school, name } = values;
    const vehicleClass = parseInt(values.class);
    const vehicleType = parseInt(values.type);
    const newEditTeam = {
      ...editTeam,
      school,
      name,
      class: vehicleClass,
      type: vehicleType,
    };
    updateTeam(newEditTeam);
    setEditTeam(undefined);
  };

  const deleteEditTeam = () => {
    removeTeam(editTeam);
    setEditTeam(undefined);
  };

  const exitEdit = () => {
    if (editTeam.name === '' && editTeam.school === '') {
      removeTeam(editTeam);
    }
    setEditTeam(undefined);
  };

  useEffect(() => {
    if (editTeam) {
      form.setValues({
        name: editTeam.name,
        school: editTeam.school,
        class: editTeam.class.toString(),
        type: editTeam.type,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTeam]);

  const teamHeader = (
    <thead>
      <tr>
        <th>ID #</th>
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
        </tr>
      ))}
    </tbody>
  );

  return (
    <Stack>
      <Group className='items-center'>
        <Title>Teams</Title>
        <Button
          leftIcon={<Plus />}
          onClick={handleAddTeamClick}
          className='bg-blue-600 hover:bg-blue-800'
        >
          Add Team
        </Button>
      </Group>
      <Table striped highlightOnHover>
        {teamHeader}
        {teamBody}
      </Table>
      <Modal
        opened={editTeam !== undefined}
        onClose={() => exitEdit()}
        title='Edit Team Details'
      >
        <form onSubmit={form.onSubmit((values) => submitEdit(values))}>
          <TextInput
            required
            label='Team Name'
            placeholder='Name'
            {...form.getInputProps('name')}
          />
          <TextInput
            required
            label='School'
            placeholder='School'
            {...form.getInputProps('school')}
          />
          <Select
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
            label='Select the Vehicle Type'
            placeholder='Pick one'
            data={[
              { value: '0', label: 'Bike' },
              { value: '1', label: 'Trike' },
              { value: '2', label: 'Kart' },
            ]}
            {...form.getInputProps('type')}
          />
          <Space h='md' />
          <Group className='justify-evenly'>
            <Button type='submit' className='bg-blue-600 hover:bg-blue-800'>
              Submit
            </Button>
            <Button
              type='button'
              className='bg-red-600 hover:bg-red-800'
              onClick={() => deleteEditTeam()}
            >
              Delete
            </Button>
          </Group>
        </form>
      </Modal>
    </Stack>
  );
};

export default Teams;
