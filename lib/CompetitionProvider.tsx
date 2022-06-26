import { createContext, PropsWithChildren, useState } from 'react';
import Team from './TeamInterface';

export interface CompetitionContextValue {
  name: string;
  setName: (string) => void;
  teams: Team[];
  addTeam: (Team) => void;
  removeTeam: (Team) => void;
  updateTeam: (Team) => void;
}

export const CompetitionContext = createContext<CompetitionContextValue>({
  name: '',
  setName: () => {},
  teams: [],
  addTeam: () => {},
  removeTeam: () => {},
  updateTeam: () => {},
});

interface CompetitionContextProps {}

const CompetitionProvider = ({
  children,
}: PropsWithChildren<CompetitionContextProps>) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState('');

  const getTeamIds = () => teams.map((t) => t.id);

  const addTeam = (team: Team) => {
    if (getTeamIds().includes(team.id)) {
      return;
    }

    setTeams([...teams, team]);
  };

  const removeTeam = (team: Team) => {
    setTeams(teams.filter((t) => t.id !== team.id));
  };

  const updateTeam = (team: Team) => {
    if (!getTeamIds().includes(team.id)) {
      return;
    }
    setTeams([...teams.filter((t) => t.id !== team.id), team]);
  };

  return (
    <CompetitionContext.Provider
      value={{
        name,
        setName,
        teams,
        addTeam,
        removeTeam,
        updateTeam
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export default CompetitionProvider;
