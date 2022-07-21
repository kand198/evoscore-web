import Team from './TeamInterface';

export const getTotalTime = (t: Team): number =>
  t.events.efficiency.lapTimes.length > 0
    ? t.events.efficiency.lapTimes.reduce(
        (totalTime, thisTime) => totalTime + thisTime
      )
    : 0;
export const getFirstTime = (t: Team): number | undefined =>
  t.events.efficiency.startTime;
export const getLastTime = (t: Team): number | undefined =>
  getFirstTime(t) !== undefined ? getFirstTime(t) + getTotalTime(t) : undefined;
export const getTimeRange = (t: Team): [startTime: number, endTime: number] => {
  const startTime = getFirstTime(t) || Date.now();
  const endTime = t.events.efficiency.running
    ? Date.now()
    : getLastTime(t) || Date.now();
  return [startTime, endTime];
};
export const getLastTimeIndex = (t: Team): number =>
  t.events.efficiency.lapTimes.length;
