type Page = {
  name: string;
  path: string;
};

const pages: Page[] = [
  { name: 'Home', path: '/' },
  // { name: 'Help', path: '/help' },
  { name: 'Teams', path: '/teams' },
  { name: 'Events', path: '/events' },
  { name: 'ECU', path: '/ecu' },
];

export const events: Page[] = [
  { name: 'Drag', path: '/events/drag' },
  { name: 'Gymkhana', path: '/events/gymkhana' },
  { name: 'Endurance', path: '/events/endurance' },
  { name: 'Efficiency', path: '/events/efficiency' },
  { name: 'Technical Report', path: '/events/technical-report' },
];

export default pages;
