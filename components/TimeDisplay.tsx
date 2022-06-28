import { Text } from '@mantine/core';

export interface TimeDisplayProps {
  value: number;
}

const TimeDisplay = (props: TimeDisplayProps) => {
  const { value } = props;
  const filteredValue = value && value > 0 ? value : 0;

  const mins = Math.max(Math.trunc(filteredValue / 60000), 0);
  const secs = Math.max(Math.trunc((filteredValue - mins * 60000) / 1000), 0);
  const millis = Math.max(filteredValue - mins * 60000 - secs * 1000, 0);

  const constructTimeString = (vals: number[]) => {
    const timeString = vals.map((n) =>
      (filteredValue > 0 ? String(n) : '--').padStart(2, '0')
    );
    timeString.splice(1, 0, ':');
    timeString.splice(3, 0, ':');
    return timeString;
  };

  return <Text>{constructTimeString([mins, secs, millis])}</Text>;
};

export default TimeDisplay;
