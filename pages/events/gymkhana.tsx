import { ActionIcon, Button, Group, Modal, ScrollArea, Space, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';
import EventInterface from '../lib/EventInterface';
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';
import { Filter, teamMeetsFilters } from '../lib/Filters';
import LapTimeInput from './LapTimeInput';
import { Trash } from 'tabler-icons-react';
import LapTimeDisplay from './LapTimeDisplay';
import TeamInterface from '../../lib/TeamInterface';

const DragTable = ({ sortBy, filters }: { sortBy?: string; filters?: Filter[] }) => {
	const { teams, updateTeam } = useCompetition();
	const [editTeam, setEditTeam] = useState<Team | undefined>(undefined);

	const filteredTeams = teams?.filter((team: Team) => teamMeetsFilters(team, filters));

	const sortedTeams = filteredTeams?.sort((a: Team, b: Team) => {
		if (!sortBy) {
			return 0;
		}
		switch (sortBy) {
			case 'time':
				return Math.min(...a.events.drag) - Math.min(...b.events.drag);
			case 'number':
			default:
				return a.id - b.id;
		}
	});

	const form = useForm({
		initialValues: {
			lapTimes: [{ time: 0 }],
		},
	});

	const submitEdit = (values: { lapTimes: { time: number }[] }) => {
		const newLapTimes: number[] = [...values.lapTimes.map((s) => Math.max(s.time, 0)).filter((n) => n !== 0)];
		const events: EventInterface = {
			...editTeam.events,
			drag: newLapTimes,
		};
		const newEditTeam = { ...editTeam, events };
		updateTeam(newEditTeam);
		setEditTeam(undefined);
	};

	useEffect(() => {
		if (editTeam) {
			const values = {
				lapTimes: editTeam.events.drag
					? editTeam.events.drag.map((lt) => ({
						time: lt,
					}))
					: [],
			};
			form.setValues(values);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editTeam]);

	const DragHeader = (
		<thead>
			<tr>
				<th>ID #</th>
				<th>Name</th>
				<th>School</th>
				<th>Class</th>
				<th>Type</th>
				{Array.from({ length: 3 }, (_, i) => i).map((i) => (
					<th key={i}>Run {i + 1}</th>
				))}
			</tr>
		</thead>
	);
	const DragBody = (
		<tbody>
			{sortedTeams?.map((team: TeamInterface) => {
				return (
					<tr key={team.id} className='hover:cursor-pointer hover:bg-gray-200' onClick={() => setEditTeam(team)}>
						<td>{team.id}</td>
						<td>{team.name}</td>
						<td>{team.school}</td>
						<td>{vehicleClassMap.get(team.class)}</td>
						<td>{vehicleTypeMap.get(team.type)}</td>
						<td>{<LapTimeDisplay value={team.events.drag[0]} />}</td>
						<td>{<LapTimeDisplay value={team.events.drag[1]} />}</td>
						<td>{<LapTimeDisplay value={team.events.drag[2]} />}</td>
					</tr>
				);
			})}
		</tbody>
	);

	return (
		<>
			<ScrollArea className='relative'>
				<Table className='overflow-x-scroll whitespace-nowrap'>
					{DragHeader}
					{DragBody}
				</Table>
				<Space h='md' />
			</ScrollArea>
			<Modal opened={editTeam !== undefined} onClose={() => setEditTeam(undefined)} title='Edit Team Details'>
				<form onSubmit={form.onSubmit((values) => submitEdit(values))}>
					<ScrollArea>
						{form.values.lapTimes &&
							form.values.lapTimes.map((_time, i) => (
								<Group className='flex-nowrap' key={i}>
									<LapTimeInput
										label={'Lap ' + (i + 1).toString()}
										value={form.values.lapTimes[i].time}
										onChange={(t) =>
											form.setValues({
												...form.values,
												lapTimes: form.values.lapTimes.map((s, index) => (i === index ? { time: t } : s)),
											})
										}
									/>
									<ActionIcon color='red' variant='subtle' className='self-end mb-1' onClick={() => form.removeListItem('lapTimes', i)}>
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
						<Button className='bg-blue-600 hover:bg-blue-800' onClick={() => form.insertListItem('lapTimes', { time: 0 })}>
							Add Time
						</Button>
					</Group>
				</form>
			</Modal>
		</>
	);
};

export default DragTable;
