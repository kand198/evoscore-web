export default interface EventInterface {
  drag: number;
  gymkhana: {
    times: number[];
    running: boolean;
    cones: number;
    bonus: number;
    loss: number;
  };
  endurance: {
    times: number[];
    running: boolean;
  };
  efficiency: {
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
    endurance: {
      times: [],
      running: false,
    },
    efficiency: {
      energy: 0,
    },
  };
};
