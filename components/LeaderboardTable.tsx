import { Button, ScrollArea, Space, Table } from '@mantine/core';
import { useCompetition } from '../lib/CompetitionProvider';
import Team, { vehicleClassMap, vehicleTypeMap } from '../lib/TeamInterface';
import { Filter, teamMeetsFilters } from '../lib/Filters';
import { getTotalTime } from '../lib/TimeHelpers';
import { getGymkhanaTimeFromRun } from './GymkhanaTable';
import { stringify } from 'csv-stringify/sync';

const LeaderboardTable = ({ sortBy, filters, hideTechnicalReport }: { sortBy?: string; filters?: Filter[]; hideTechnicalReport?: boolean }) => {
  const { teams, laps, metadata } = useCompetition();

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
    if (time === minTime || maxTime === minTime) return 100;
    return ((maxTime - time) / (maxTime - minTime)) * 100;
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
    if (time === minTime || maxTime === minTime) return 100;
    return ((maxTime - time) / (maxTime - minTime)) * 100;
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
    if (time === minTime || maxTime === minTime) return 100;
    return ((maxTime - time) / (maxTime - minTime)) * 100;
  };

  const getEfficiencyPoints = (team: Team) => {
    const energy = team.events.efficiency.energy;
    const lapsCompleted = team.events.endurance.lapTimes.length;
    if (!energy || lapsCompleted < laps) return 0;
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
        .filter((e) => e > 0 && e !== Infinity)
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
        .filter((e) => e > 0 && e !== Infinity)
    );
    if (energy === minEnergy || maxEnergy === minEnergy) return 100;
    return ((maxEnergy - energy) / (maxEnergy - minEnergy)) * 100;
  };

  const getTechnicalReportPoints = (team: Team) => {
    if (hideTechnicalReport) return 0;
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

  const exportLeaderboard = () => {
    const classTypeList = [
      ...new Set(
        sortedTeams?.map((team) => {
          return `${team.class} ${team.type}`;
        })
      ),
    ];

    const classTypeScores = classTypeList.map((classType) => {
      const classTypeTeams = sortedTeams?.filter((team) => {
        return `${team.class} ${team.type}` === classType;
      });
      const teamScores = classTypeTeams.map((team) => ({
        name: team.name,
        school: team.school,
        class: team.class,
        type: team.type,
        overall: getTotalPoints(team),
        drag: getDragPoints(team),
        gymkhana: getGymkhanaPoints(team),
        endurance: getEndurancePoints(team),
        efficiency: getEfficiencyPoints(team),
      }));
      const eventRankings = teamScores
        .map((team) => ({
          name: team.name,
          school: team.school,
          class: vehicleClassMap.get(team.class),
          type: vehicleTypeMap.get(team.type),
          overall:
            teamScores
              .map((team) => team.overall)
              .sort((a, b) => b - a)
              .indexOf(team.overall) + 1,
          drag:
            teamScores
              .map((team) => team.drag)
              .sort((a, b) => b - a)
              .indexOf(team.drag) + 1,
          gymkhana:
            teamScores
              .map((team) => team.gymkhana)
              .sort((a, b) => b - a)
              .indexOf(team.gymkhana) + 1,
          endurance:
            teamScores
              .map((team) => team.endurance)
              .sort((a, b) => b - a)
              .indexOf(team.endurance) + 1,
          efficiency:
            teamScores
              .map((team) => team.efficiency)
              .sort((a, b) => b - a)
              .indexOf(team.efficiency) + 1,
        }))
        .sort((a, b) => a.overall - b.overall);
      return {
        classType,
        eventRankings,
      };
    });

    const columns = ['name', 'school', 'class', 'type', 'overall', 'drag', 'gymkhana', 'endurance', 'efficiency'];

    // Generate a separate CSV object for each class type
    const csvs = classTypeScores.map((classTypeScore) => {
      const { classType, eventRankings } = classTypeScore;
      const csv = stringify(eventRankings, { header: true, columns });
      return { classType, csv };
    });

    // Combine CSVs into one CSV with an empty line between each class type
    const combinedCsv = csvs.reduce((acc, csv) => {
      return acc + csv.csv + '\n\n';
    }, '');

    // Download the CSV
    const blob = new Blob([combinedCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leaderboard-${metadata.name}.csv`);
    document.body.appendChild(link);
    link.click();
  };

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
        {!hideTechnicalReport && <th>Technical Report</th>}
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
            <td>{getTotalPoints(team).toFixed(2)}</td>
            <td>{getDragPoints(team).toFixed(2)}</td>
            <td>{getGymkhanaPoints(team).toFixed(2)}</td>
            <td>{getEndurancePoints(team).toFixed(2)}</td>
            <td>{getEfficiencyPoints(team).toFixed(2)}</td>
            {!hideTechnicalReport && <td>{getTechnicalReportPoints(team).toFixed(2)}</td>}
          </tr>
        );
      })}
    </tbody>
  );

  return (
    <>
      <ScrollArea className='relative'>
        <Button type='button' className='bg-blue-600 hover:bg-blue-800' onClick={() => exportLeaderboard()}>
          Download Report
        </Button>
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
