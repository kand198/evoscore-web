import { Text } from '@mantine/core';

export interface LapTimeDisplayProps {
  value: number;
}

const LapTimeDisplay = (props: LapTimeDisplayProps) => {
  const { value } = props;
  const filteredValue = value && value > 0 ? value : 0;

  const time = new Date(filteredValue);

  const constructTimeString = (vals: number[]) => {
    const timeString = vals.map((n, i) => {
      const isMs = i == 2;
      const dashString = isMs ? '---' : '--';
      const padLength = isMs ? 3 : 2;
      return (filteredValue > 0 ? String(n) : dashString).padStart(
        padLength,
        '0'
      );
    });
    timeString.splice(1, 0, ':');
    timeString.splice(3, 0, '.');
    return timeString;
  };

  return (
    <Text>
      {constructTimeString([
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds(),
      ])}
    </Text>
  );
};

export default LapTimeDisplay;
