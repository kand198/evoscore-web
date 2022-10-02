import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import Team, { emptyTeam } from './TeamInterface';

export type CompetitionMetadata = {
  name: string;
  region?: string;
  scorePerson?: string;
  date?: number;
  lastEdited?: number;
};

export interface CompetitionContextValue {
  metadata: CompetitionMetadata;
  setMetadata: (CompetitionMetadata) => void;
  laps: number;
  setLaps: (number) => void;
  teams: Team[];
  addTeam: () => Team;
  removeTeam: (Team) => void;
  updateTeam: (Team) => void;
  setTeams: (Teams) => void;
}

export const CompetitionContext = createContext<CompetitionContextValue>({
  metadata: { name: '' },
  setMetadata: () => {},
  laps: 0,
  setLaps: () => {},
  teams: [],
  addTeam: () => emptyTeam(),
  removeTeam: () => {},
  updateTeam: () => {},
  setTeams: () => {},
});

export const useCompetition = () => useContext(CompetitionContext);

interface CompetitionContextProps {}

const CompetitionProvider = ({ children }: PropsWithChildren<CompetitionContextProps>) => {
  const [metadata, setMetadata] = useState<CompetitionMetadata>({ name: '' });
  const [laps, setLaps] = useState<number>(0);
  const [teams, setTeams] = useState<Team[] | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMetadata(JSON.parse(localStorage.getItem('competitionMetadata')) || { name: '' });
      setLaps(parseInt(localStorage.getItem('competitionLaps') || '1'));
      const localTeams = localStorage.getItem('competitionTeams');
      if (localTeams) setTeams(JSON.parse(localTeams));
      else setTeams([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && metadata.name !== '') localStorage.setItem('competitionMetadata', JSON.stringify(metadata));
  }, [metadata]);
  useEffect(() => {
    if (typeof window !== 'undefined' && laps !== 0) localStorage.setItem('competitionLaps', laps.toString());
  }, [laps]);
  useEffect(() => {
    if (typeof window !== 'undefined' && teams) localStorage.setItem('competitionTeams', JSON.stringify(teams));
  }, [teams]);

  const getTeamIds = () => teams?.map((t) => t.id);

  const addTeam = () => {
    const newTeam = {
      ...emptyTeam(),
      id: getTeamIds().reduce((maxId, id) => Math.max(maxId, id), -1) + 1,
    };
    setTeams([...teams, newTeam]);
    return newTeam;
  };

  const removeTeam = (team: Team) => {
    setTeams(teams?.filter((t) => t.id !== team.id));
  };

  const updateTeam = (team: Team) => {
    if (!getTeamIds().includes(team.id)) {
      return;
    }
    setTeams(teams?.map((t) => (t.id === team.id ? team : t)));
  };

  return (
    <CompetitionContext.Provider
      value={{
        metadata,
        setMetadata,
        laps,
        setLaps,
        teams,
        addTeam,
        removeTeam,
        updateTeam,
        setTeams,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export default CompetitionProvider;
