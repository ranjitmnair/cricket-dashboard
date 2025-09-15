export interface Match {
  id: number;
  team1: Team;
  team2: Team;
  status: "live" | "upcoming" | "completed";
  venue: string;
  date: string;
  time: string;
  score?: {
    team1: MatchScore;
    team2: MatchScore;
  } | null;
  result?: string | null;
}
export interface MatchScore {
  runs: number;
  wickets: number;
  overs: number;
}
export interface Team {
  name: string;
  shortName: string;
}


export interface PointsTableEntry {
  position: number
  team: Team
  matches: number
  won: number
  lost: number
  points: number
  nrr: string
  form: string[]
}