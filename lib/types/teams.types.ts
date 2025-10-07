// lib/types/teams.types.ts
export interface Team {
  id: string;
  name: string;
  description: string | null;
  avatar: string;
  owner_id: string;
  total_points: number;
  member_count: number;
  max_members: number;
  is_private: boolean;
  invite_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  points_contributed: number;
  joined_at: string;
  user_stats?: {
    name: string;
    avatar: string;
    points: number;
  };
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  inviter_id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at: string;
  team?: Team;
}