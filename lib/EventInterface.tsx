export default interface EventInterface {
  drag: number[];
  gymkhana: {
    runs: {
      time: number;
      cones: number;
      bonus: number;
      loss: number;
    }[];
  };
  endurance: {
    startTime: number;
    lapTimes: number[];
  };
  efficiency: {
    energy: number;
  };
  technicalReport: number;
}

export const emptyEvents = (): EventInterface => {
  return {
    drag: [],
    gymkhana: {
      runs: [],
    },
    endurance: {
      startTime: 0,
      lapTimes: [],
    },
    efficiency: {
      energy: 0,
    },
    technicalReport: 0,
  };
};
