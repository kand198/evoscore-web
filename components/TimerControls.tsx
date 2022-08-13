import { Group, ActionIcon } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import {
  PlayerPlay,
  TrashX,
  PlayerStop,
  PlayerTrackNext,
} from 'tabler-icons-react';
import { useCompetition } from '../lib/CompetitionProvider';
import Team from '../lib/TeamInterface';
import LapTimeDisplay from './LapTimeDisplay';
import { TimerMode } from './Timer';

const TimerControls = (props: { team: Team; mode: TimerMode }) => {
  const [timerState, setTimerState] = useState('stopped');
  const { updateTeam } = useCompetition();
  const timerRef = useRef<NodeJS.Timer>();
  const lapTimesRef = useRef<number[]>([]);
  const { team, mode } = props;

  const getTotalTime = () => {
    return team.events.efficiency.lapTimes?.reduce(
      (total, time) => (total += time),
      0
    );
  };

  const getRunningTime = () => {
    // console.log(team.events.efficiency.lapTimes);
    if (team.events.efficiency.running) {
      return Date.now() - team.events.efficiency.startTime;
    }
    return getTotalTime();
  };

  const handleTimerStart = () => {
    const newTeam = { ...team };
    newTeam.events.efficiency.running = true;
    newTeam.events.efficiency.startTime = Date.now();
    updateTeam(newTeam);
  };

  const handleTimerStop = () => {
    const newTeam = { ...team };
    newTeam.events.efficiency.running = false;
    updateTeam(newTeam);
  };

  const handleReset = () => {
    const newTeam = { ...team };
    newTeam.events.efficiency.running = false;
    newTeam.events.efficiency.lapTimes = [];
    lapTimesRef.current = [];
    updateTeam(newTeam);
  };

  const handleLap = () => {
    lapTimesRef.current.push(0);
    const newTeam = { ...team };
    newTeam.events.efficiency.lapTimes = lapTimesRef.current;
    updateTeam(newTeam);
  };

  useEffect(() => {
    const upCount = () => {
      const index = Math.max(lapTimesRef.current.length - 1, 0);
      const previousLaps = lapTimesRef.current.slice(0, -1);
      const previousLapsTotal = previousLaps.reduce((l, c) => l + c, 0);
      lapTimesRef.current[index] =
        Date.now() - (team.events.efficiency.startTime + previousLapsTotal);
      const newTeam = { ...team };
      newTeam.events.efficiency.lapTimes = lapTimesRef.current;
      updateTeam(newTeam);
    };

    if (team.events.efficiency.running) {
      setTimerState('running');
      timerRef.current = setInterval(() => upCount(), 16);
    } else {
      setTimerState('stopped');
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  return (
    <Group>
      {team.events.efficiency.lapTimes.map((lt, i) => (
        <LapTimeDisplay key={i} value={lt} />
      ))}
      <LapTimeDisplay value={getRunningTime()} />
      {timerState === 'stopped' && (
        <>
          <ActionIcon
            className=''
            onClick={handleTimerStart}
            disabled={team.events.efficiency.lapTimes.length > 0}
          >
            <PlayerPlay size={32} />
          </ActionIcon>
          <ActionIcon className='' onClick={handleReset}>
            <TrashX size={32} />
          </ActionIcon>
        </>
      )}
      {timerState === 'running' && (
        <>
          <ActionIcon className='' onClick={handleTimerStop}>
            <PlayerStop size={32} />
          </ActionIcon>
          <ActionIcon className='' onClick={handleLap}>
            <PlayerTrackNext size={32} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
};

export default TimerControls;
