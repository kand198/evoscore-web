import { Text } from '@mantine/core';

export interface TimeDisplayProps {
  value: number;
}

const TimeDisplay = (props: TimeDisplayProps) => {
  const { value } = props;
  const filteredValue = value && value > 0 ? value : 0;

  const time = new Date(filteredValue);

  const constructTimeString = (vals: number[]) => {
    const timeString = vals.map((n) => (filteredValue > 0 ? String(n) : '--').padStart(2, '0'));
    timeString.splice(1, 0, ':');
    timeString.splice(3, 0, ':');
    return timeString;
  };

  return <Text>{constructTimeString([time.getHours(), time.getMinutes(), time.getSeconds()])}</Text>;
};

export default TimeDisplay;
