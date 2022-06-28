import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import {
  PlayerPause,
  PlayerPlay,
  PlayerStop,
  PlayerTrackNext,
  TrashX,
} from 'tabler-icons-react';

export type TimerMode = 'efficiency' | 'drag' | 'gymkhana';

export interface TimerProps {
  mode: TimerMode;
}

const Timer = (props: TimerProps) => {
  const { mode } = props;
  const [timerState, setTimerState] = useState('stopped');
  return (
    <Stack>
      <Group>
        {timerState === 'stopped' && (
          <>
            <ActionIcon className='' onClick={() => setTimerState('running')}>
              <PlayerPlay size={32} />
            </ActionIcon>
            <ActionIcon className=''>
              <TrashX size={32} />
            </ActionIcon>
          </>
        )}
        {timerState === 'running' && (
          <>
            <ActionIcon className='' onClick={() => setTimerState('stopped')}>
              <PlayerStop size={32} />
            </ActionIcon>
            <ActionIcon className=''>
              <PlayerTrackNext size={32} />
            </ActionIcon>
          </>
        )}
      </Group>
    </Stack>
  );
};

export default Timer;
