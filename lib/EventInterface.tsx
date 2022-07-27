export default interface EventInterface {
  drag: number;
  gymkhana: {
    times: number[];
    running: boolean;
    cones: number;
    bonus: number;
    loss: number;
  };
  efficiency: {
    startTime: number;
    lapTimes: number[];
    running: boolean;
    energy: number;
  };
}

export const emptyEvents = () => {
  return {
    drag: 0,
    gymkhana: {
      times: [],
      running: false,
      cones: 0,
      bonus: 0,
      loss: 0,
    },
    efficiency: {
      startTime: 0,
      lapTimes: [],
      running: false,
      energy: 0,
    },
  };
};
