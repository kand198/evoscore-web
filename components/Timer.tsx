import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { PlayerPause, PlayerPlay, PlayerStop, PlayerTrackNext, TrashX } from 'tabler-icons-react';
import { useCompetition } from '../lib/CompetitionProvider';
import TimerControls from './TimerControls';

export type TimerMode = 'efficiency' | 'drag' | 'gymkhana';

export interface TimerProps {
  mode: TimerMode;
}

const Timer = (props: TimerProps) => {
  const { teams, updateTeam, laps } = useCompetition();
  const { mode } = props;

  return (
    <Stack>
      {teams?.map((t) => (
        <Group key={t.name} className='justify-between'>
          <Text>{t.name}</Text>
          <TimerControls team={t} mode={mode} />
        </Group>
      ))}
    </Stack>
  );
};

export default Timer;
