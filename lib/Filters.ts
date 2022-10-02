import Team, { vehicleClassMap, vehicleTypeMap } from './TeamInterface';

export type Filter = {
  value: string;
  label: string;
  group?: string;
  active?: boolean;
};

export const defaultFilters: Filter[] = [
  {
    value: 'standard',
    label: 'Standard (350W)',
    group: 'Class',
  },
  { value: 'open', label: 'Open (1kW)', group: 'Class' },
  {
    value: 'competition',
    label: 'Competition (3kW)',
    group: 'Class',
  },
  { value: 'bike', label: 'Bike', group: 'Type' },
  { value: 'kart', label: 'Kart', group: 'Type' },
];

export const teamMeetsFilters = (team: Team, filters: Filter[]) => {
  const activeFilters = filters.filter((f) => f.active);
  if (!activeFilters || activeFilters.length === 0) return true;
  const typeFilters = activeFilters.filter((f) => f.group === 'Type');
  const classFilters = activeFilters.filter((f) => f.group === 'Class');
  console.log(typeFilters, classFilters);
  console.log(vehicleTypeMap.get(team.type));
  if (typeFilters.length > 0) {
    if (!typeFilters.some((f) => f.value.toUpperCase() === vehicleTypeMap.get(team.type).toUpperCase())) {
      return false;
    }
  }
  if (classFilters.length > 0) {
    if (!classFilters.some((f) => f.value.toUpperCase() === vehicleClassMap.get(team.class).toUpperCase())) {
      return false;
    }
  }
  return true;
};
