import { Button, Stack, Text, TextInput, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';

const Home = () => {
  const { metadata, setMetadata, laps, setLaps, teams, setTeams } = useCompetition();

  const [saved, setSaved] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      region: '',
      scorePerson: '',
      date: new Date(Date.now()),
    },
  });

  useEffect(() => {
    const { name, region, scorePerson, date } = metadata;
    const nameIsSame = form.values.name === name;
    const regionIsSame = form.values.region === (region ?? '');
    const scorePersonIsSame = form.values.scorePerson === (scorePerson ?? '');
    const dateIsSame = form.values.date?.valueOf() === (date ?? Date.now());
    setSaved(nameIsSame && regionIsSame && scorePersonIsSame && dateIsSame);
  }, [form.values, metadata]);

  const downloadCompetition = () => {
    // Combine metadata, laps, and teams into a single object
    const competition = {
      metadata,
      laps,
      teams,
    };
    // Create a blob from the competition object
    const blob = new Blob([JSON.stringify(competition)], {
      type: 'application/json',
    });
    // Create a URL from the blob
    const url = URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement('a');
    // Set the link's href to the URL
    link.href = url;
    // Set the link's download attribute to the competition name
    link.download = metadata.name;
    // Click the link
    link.click();
    // Revoke the URL
    URL.revokeObjectURL(url);
    // Remove the link
    link.remove();
  };

  const uploadCompetiton = () => {
    // Create a file input element
    const input = document.createElement('input');
    // Set the input's type to file
    input.type = 'file';
    // Set the input's accept attribute to JSON files
    input.accept = '.json';
    // Set the input's onchange attribute to a function that reads the file
    input.onchange = (e) => {
      // Get the file from the input
      const file = (e.target as HTMLInputElement).files?.[0];
      // If the file exists
      if (file) {
        // Create a file reader
        const reader = new FileReader();
        // Set the reader's onload attribute to a function that parses the file
        reader.onload = (e) => {
          // Get the file's contents
          const contents = e.target?.result;
          // If the file's contents exist
          if (contents) {
            // Parse the file's contents as JSON
            const competition = JSON.parse(contents as string);
            // Set the metadata, laps, and teams
            setMetadata(competition.metadata);
            setLaps(competition.laps ?? 0);
            setTeams(competition.teams ?? []);
          }
        };
        // Read the file as text
        reader.readAsText(file);
      }
    };
    // Click the input
    input.click();
    // Remove the input
    input.remove();
  };

  useEffect(() => {
    if (metadata) {
      form.setValues({
        name: metadata.name ?? '',
        region: metadata.region ?? '',
        scorePerson: metadata.scorePerson ?? '',
        date: new Date(metadata.date ?? Date.now()),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  return (
    <Stack className='max-w-md'>
      <Title>Home</Title>
      <Text>Welcome to EVoScore!</Text>
      <form
        onSubmit={form.onSubmit((values) =>
          setMetadata({ ...metadata, ...values, date: values.date?.valueOf() ?? metadata.date ?? Date.now(), lastEdit: Date.now() })
        )}
      >
        <Stack>
          <TextInput label='Competition Name' placeholder='Name' {...form.getInputProps('name')} />
          <TextInput label='Region' placeholder='Region' {...form.getInputProps('region')} />
          <TextInput label='Score Person' placeholder='Score Person' {...form.getInputProps('scorePerson')} />
          <DatePicker label='Date' placeholder='Date' {...form.getInputProps('date')} />
          <Button type='submit' className='bg-blue-600 hover:bg-blue-800' disabled={saved}>
            Save
          </Button>
          <Button type='button' onClick={() => downloadCompetition()} className='bg-green-600 hover:bg-green-800' disabled={!saved}>
            Download
          </Button>
          <Button type='button' onClick={() => uploadCompetiton()} className='bg-red-600 hover:bg-red-800'>
            Upload
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default Home;
