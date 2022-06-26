import { createContext, PropsWithChildren, useContext, useState } from 'react';
import Team, { emptyTeam } from './TeamInterface';

export interface CompetitionContextValue {
  name: string;
  setName: (string) => void;
  teams: Team[];
  addTeam: () => Team;
  removeTeam: (Team) => void;
  updateTeam: (Team) => void;
}

export const CompetitionContext = createContext<CompetitionContextValue>({
  name: '',
  setName: () => {},
  teams: [],
  addTeam: () => emptyTeam(),
  removeTeam: () => {},
  updateTeam: () => {},
});

export const useCompetition = () => useContext(CompetitionContext);

interface CompetitionContextProps {}

const CompetitionProvider = ({
  children,
}: PropsWithChildren<CompetitionContextProps>) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState('');

  const getTeamIds = () => teams.map((t) => t.id);

  const addTeam = () => {
    const newTeam = {
      ...emptyTeam(),
      id: getTeamIds().reduce((maxId, id) => Math.max(maxId, id), -1) + 1,
    };
    setTeams([...teams, newTeam]);
    return newTeam;
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
        updateTeam,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export default CompetitionProvider;
