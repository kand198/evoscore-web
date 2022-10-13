import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
  addTeam: (team: Team) => void;
  removeTeam: (Team) => void;
  updateTeam: (Team: Team) => void;
  setTeams: (Teams) => void;
  reset: () => void;
}

export const CompetitionContext = createContext<CompetitionContextValue>({
  metadata: { name: '' },
  setMetadata: () => {},
  laps: 0,
  setLaps: () => {},
  teams: [],
  addTeam: () => {},
  removeTeam: () => {},
  updateTeam: () => {},
  setTeams: () => {},
  reset: () => {},
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

  const getTeamIds = useCallback(() => teams?.map((t) => t.id), [teams]);

  const addTeam = useCallback(
    (team: Team) => {
      if (teams.map((t) => t.id).includes(team.id)) return;
      setTeams((ts) => [...ts, team]);
    },
    [teams]
  );

  const removeTeam = useCallback(
    (team: Team) => {
      setTeams(teams?.filter((t) => t.id !== team.id));
    },
    [teams]
  );

  const updateTeam = useCallback(
    (team: Team) => {
      if (!team || team.id === undefined || team.id === null || !team.number) return;
      if (!getTeamIds().includes(team.id)) {
        addTeam(team);
      }
      setTeams((ts) => ts?.map((t) => (t.id === team.id ? team : t)));
    },
    [addTeam, getTeamIds]
  );

  const reset = () => {
    setMetadata({ name: '' });
    setLaps(0);
    setTeams([]);
  };

  const value = useMemo(
    () => ({
      metadata,
      setMetadata,
      laps,
      setLaps,
      teams,
      addTeam,
      removeTeam,
      updateTeam,
      setTeams,
      reset,
    }),
    [metadata, laps, teams, addTeam, removeTeam, updateTeam]
  );

  return <CompetitionContext.Provider value={value}>{children}</CompetitionContext.Provider>;
};

export default CompetitionProvider;
