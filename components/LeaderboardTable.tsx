import { ActionIcon, Button, Group, Modal, NumberInput, ScrollArea, Space, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useCompetition } from '../lib/CompetitionProvider';
import EventInterface from '../lib/EventInterface';
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';
import { Filter, teamMeetsFilters } from '../lib/Filters';
import LapTimeInput from './LapTimeInput';
import { Trash } from 'tabler-icons-react';
import LapTimeDisplay from './LapTimeDisplay';
import { getTotalTime } from '../lib/TimeHelpers';
import { getGymkhanaTimeFromRun } from './GymkhanaTable';

const LeaderboardTable = ({ sortBy, filters }: { sortBy?: string; filters?: Filter[] }) => {
  const { teams } = useCompetition();

  const getDragPoints = (team: Team) => {
    const time = Math.min(...team.events.drag);
    if (!time || time === Infinity) return 0;
    const vClass = team.class;
    const vType = team.type;
    const maxTime =
      Math.max(
        ...teams
          .filter((t) => t.class === vClass && t.type === vType)
          .map((t) => Math.min(...t.events.drag))
          .filter((t) => t && t !== Infinity)
      ) * 1.1;
    const minTime = Math.min(
      ...teams
        .filter((t) => t.class === vClass && t.type === vType)
        .map((t) => Math.min(...t.events.drag))
        .filter((t) => t && t !== Infinity)
    );
    return Math.round(((maxTime - time) / (maxTime - minTime)) * 100);
  };

  const getGymkhanaPoints = (team: Team) => {
    const calcFastestGymkhanaTime = (rs) => Math.min(...rs.map((r) => getGymkhanaTimeFromRun(r)));
    const time = calcFastestGymkhanaTime(team.events.gymkhana.runs);
    if (!time || time === Infinity) return 0;
    const vClass = team.class;
    const vType = team.type;
    const maxTime =
      Math.max(
        ...teams
          .filter((t) => t.class === vClass && t.type === vType)
          .map((t) => calcFastestGymkhanaTime(t.events.gymkhana.runs))
          .filter((t) => t > 0 && t !== Infinity)
      ) * 1.1;
    const minTime = Math.min(
      ...teams
        .filter((t) => t.class === vClass && t.type === vType)
        .map((t) => calcFastestGymkhanaTime(t.events.gymkhana.runs))
        .filter((t) => t > 0 && t !== Infinity)
    );
    return Math.round(((maxTime - time) / (maxTime - minTime)) * 100);
  };

  const getEndurancePoints = (team: Team) => {
    const time = getTotalTime(team);
    if (!time || time === Infinity) return 0;
    const vClass = team.class;
    const vType = team.type;
    const maxTime =
      Math.max(
        ...teams
          .filter((t) => t.class === vClass && t.type === vType)
          .map((t) => getTotalTime(t))
          .filter((t) => t > 0 && t !== Infinity)
      ) * 1.1;
    const minTime = Math.min(
      ...teams
        .filter((t) => t.class === vClass && t.type === vType)
        .map((t) => getTotalTime(t))
        .filter((t) => t > 0 && t !== Infinity)
    );
    return Math.round(((maxTime - time) / (maxTime - minTime)) * 100);
  };

  const getEfficiencyPoints = (team: Team) => {
    const energy = team.events.efficiency.energy;
    if (!energy) return 0;
    const vClass = team.class;
    const vType = team.type;
    const maxEnergy = Math.max(
      ...teams
        .filter((t) => t.class === vClass && t.type === vType)
        .map(
          ({
            events: {
              efficiency: { energy },
            },
          }) => energy
        )
    );
    const minEnergy = Math.min(
      ...teams
        .filter((t) => t.class === vClass && t.type === vType)
        .map(
          ({
            events: {
              efficiency: { energy },
            },
          }) => energy
        )
    );
    return ((maxEnergy - energy) / (maxEnergy - minEnergy)) * 100;
  };

  const getTechnicalReportPoints = (team: Team) => {
    const points = team.events.technicalReport;
    const vClass = team.class;
    const vType = team.type;
    const maxPoints = Math.max(
      ...teams
        .filter((t) => t.class === vClass && t.type === vType)
        .map((team) => team.events.technicalReport)
        .filter((t) => t > 0)
    );
    const minPoints = 0;
    return ((points - minPoints) / (maxPoints - minPoints)) * 100;
  };

  const getTotalPoints = (team: Team) => {
    const dragPoints = getDragPoints(team);
    const gymkhanaPoints = getGymkhanaPoints(team);
    const endurancePoints = getEndurancePoints(team);
    const efficiencyPoints = getEfficiencyPoints(team);
    const technicalReportPoints = getTechnicalReportPoints(team);
    return dragPoints + gymkhanaPoints + endurancePoints + efficiencyPoints + technicalReportPoints;
  };

  const filteredTeams = teams?.filter((team: Team) => teamMeetsFilters(team, filters));

  const sortedTeams = filteredTeams?.sort((a: Team, b: Team) => {
    if (!sortBy) {
      return 0;
    }
    switch (sortBy) {
      case 'points':
        return Math.min(getTotalPoints(b)) - Math.min(getTotalPoints(a));
      case 'number':
      default:
        return a.number - b.number;
    }
  });

  const LeaderboardHeader = (
    <thead>
      <tr>
        <th>Race #</th>
        <th>Name</th>
        <th>School</th>
        <th>Class</th>
        <th>Type</th>
        <th>Total Points</th>
        <th>Drag</th>
        <th>Gymkhana</th>
        <th>Endurance</th>
        <th>Efficiency</th>
        <th>Technical Report</th>
      </tr>
    </thead>
  );
  const LeaderboardBody = (
    <tbody>
      {sortedTeams?.map((team) => {
        return (
          <tr key={team.id} className='hover:bg-gray-200'>
            <td>{team.number}</td>
            <td>{team.name}</td>
            <td>{team.school}</td>
            <td>{vehicleClassMap.get(team.class)}</td>
            <td>{vehicleTypeMap.get(team.type)}</td>
            <td>{getTotalPoints(team)}</td>
            <td>{getDragPoints(team)}</td>
            <td>{getGymkhanaPoints(team)}</td>
            <td>{getEndurancePoints(team)}</td>
            <td>{getEfficiencyPoints(team)}</td>
            <td>{getTechnicalReportPoints(team)}</td>
          </tr>
        );
      })}
    </tbody>
  );

  return (
    <>
      <ScrollArea className='relative'>
        <Table className='overflow-x-scroll whitespace-nowrap'>
          {LeaderboardHeader}
          {LeaderboardBody}
        </Table>
        <Space h='md' />
      </ScrollArea>
    </>
  );
};

export default LeaderboardTable;
