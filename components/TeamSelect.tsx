import { Button, Select, SelectItem } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useEffect } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';
import useEcu from '../lib/EcuContext';

const TeamSelect = () => {
  const { ecuTeam, ecuState, setEcuTeam } = useEcu();
  const { teams } = useCompetition();

  const teamForm = useForm({
    initialValues: {
      id: '',
    },
  });

  const submitTeamForm = (values: { id: string }) => {
    const team = teams?.find((t) => t.id === parseInt(values.id));
    setEcuTeam(team);
  };

  useEffect(() => {
    teamForm.setValues({ id: ecuTeam?.id.toString() || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecuTeam]);

  return (
    <form
      onSubmit={teamForm.onSubmit((values) => submitTeamForm(values))}
      className='w-full flex flex-row gap-x-2 items-end'
    >
      <Select
        label='Select the Team for this ECU'
        placeholder='Pick one'
        className='max-w-md'
        data={teams?.map<SelectItem>((t) => {
          return { value: t.id.toString(), label: t.name };
        })}
        disabled={ecuState !== 'Ready'}
        {...teamForm.getInputProps('id')}
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

export default TeamSelect;
