import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import Team, { emptyTeam } from './TeamInterface';

export interface CompetitionContextValue {
  name: string;
  setName: (string) => void;
  laps: number;
  setLaps: (number) => void;
  teams: Team[];
  addTeam: () => Team;
  removeTeam: (Team) => void;
  updateTeam: (Team) => void;
}

export const CompetitionContext = createContext<CompetitionContextValue>({
  name: '',
  setName: () => {},
  laps: 0,
  setLaps: () => {},
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
  const [name, setName] = useState<string>('');
  const [laps, setLaps] = useState<number>(0);
  const [teams, setTeams] = useState<Team[] | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('competitionName') || '');
      setLaps(parseInt(localStorage.getItem('competitionLaps') || '1'));
      const localTeams = localStorage.getItem('competitionTeams');
      if (localTeams) setTeams(JSON.parse(localTeams));
      else setTeams([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && name !== '')
      localStorage.setItem('competitionName', name);
  }, [name]);
  useEffect(() => {
    if (typeof window !== 'undefined' && laps !== 0)
      localStorage.setItem('competitionLaps', laps.toString());
  }, [laps]);
  useEffect(() => {
    if (typeof window !== 'undefined' && teams)
      localStorage.setItem('competitionTeams', JSON.stringify(teams));
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
        name,
        setName,
        laps,
        setLaps,
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
