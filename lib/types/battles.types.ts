// lib/types/battles.types.ts
export interface Battle {
  id: string;
  title: string;
  description: string | null;
  battle_type: '1v1' | 'team' | 'free_for_all';
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  problem_ids: number[];
  max_participants: number;
  duration_minutes: number;
  created_by: string;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface BattleParticipant {
  id: string;
  battle_id: string;
  user_id: string;
  team_id: string | null;
  score: number;
  problems_solved: number[];
  rank: number | null;
  joined_at: string;
  user_stats?: {
    name: string;
    avatar: string;
  };
}

export interface BattleSubmission {
  id: string;
  battle_id: string;
  user_id: string;
  problem_id: number;
  solved: boolean;
  time_taken_seconds: number | null;
  submitted_at: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  tournament_type: 'single_elimination' | 'round_robin';
  status: 'registration' | 'in_progress' | 'completed';
  max_participants: number;
  current_round: number;
  prize_pool: number;
  created_by: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}