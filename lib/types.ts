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

export interface ScheduleMatch {
  id: number
  matchNumber: string
  team1: Team
  team2: Team
  date: string
  time: string
  venue: string
  status: "upcoming" | "completed" | "live"
  result?: string | null
}

export interface NotificationSettings {
  enabled: boolean
  wickets: boolean
  boundaries: boolean
  milestones: boolean
  matchUpdates: boolean
  browserNotifications: boolean
}

export interface MatchEvent {
  id: string
  matchId: number
  type: "wicket" | "boundary" | "six" | "milestone" | "match_start" | "match_end" | "innings_break"
  timestamp: string
  description: string
  significance: "low" | "medium" | "high"
  data?: {
    player?: string
    runs?: number
    over?: number
    team?: string
  }
}