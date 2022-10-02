import EventInterface, { emptyEvents } from './EventInterface';
import { VehicleClass } from './proto/evolocity';

export enum VehicleType {
  BIKE = 0,
  KART = 1,
  UNRECOGNIZED = -1,
}
export default interface Team {
  id: number;
  number: number;
  school: string;
  class: VehicleClass;
  type?: VehicleType;
  name: string;
  events: EventInterface;
}

export const emptyTeam = (): Team => {
  return {
    id: -1,
    number: -1,
    school: '',
    class: VehicleClass.UNRECOGNIZED,
    type: VehicleType.UNRECOGNIZED,
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

export const vehicleTypeMap = new Map<VehicleType | undefined, string>([
  [undefined, 'Unknown'],
  [VehicleType.BIKE, 'Bike'],
  [VehicleType.KART, 'Kart'],
]);
