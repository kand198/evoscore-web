import EventInterface, { emptyEvents } from './EventInterface';
import { VehicleClass } from './proto/evolocity';

export default interface Team {
  id: number;
  school: string;
  class: VehicleClass;
  name: string;
  events: EventInterface;
}

export const emptyTeam = (): Team => {
  return {
    id: -1,
    school: '',
    class: VehicleClass.UNRECOGNIZED,
    name: '',
    events: emptyEvents(),
  };
};
