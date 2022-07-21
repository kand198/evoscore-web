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

export const vehicleClassMap = new Map<VehicleClass, string>([
  [VehicleClass.UNRECOGNIZED, 'Unknown'],
  [VehicleClass.STANDARD, 'Standard'],
  [VehicleClass.OPEN, 'Open'],
  [VehicleClass.COMPETITION, 'Competition'],
]);
