export interface UserStats {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  avatar: string;
  points: number;
  streak: number;
  solved_count: number;
  solved_problems: number[];
  leetcode_username: string | null;
  leetcode_stats: LeetCodeStats | null;
  last_solved: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeetCodeStats {
  username: string;
  realName: string;
  ranking: number;
  reputation: number;
  solved: {
    easy: number;
    medium: number;
    hard: number;
    all: number;
  };
  submissions: {
    easy: number;
    medium: number;
    hard: number;
    all: number;
  };
  calendar: {
    streak: number;
    totalActiveDays: number;
    submissionCalendar: Record<string, number>;
  };
  contestRanking: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    topPercentage: string;
  };
  badges: Array<{
    displayName: string;
    icon: string;
  }>;
  recentSubmissions: Array<{
    title: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }>;
  lastUpdated: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  avatar: string;
  color: string;
  owner_id: string;
  is_public: boolean;
  max_members: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface TeamChatMessage {
  id: string;
  team_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_stats?: UserStats;
}

export interface CustomSheet {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  team_id: string | null;
  is_public: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CustomSheetProblem {
  id: string;
  sheet_id: string;
  problem_number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string | null;
  notes: string | null;
  is_solved: boolean;
  added_by: string;
  created_at: string;
}

export interface LiveRoom {
  id: string;
  name: string;
  problem_number: number | null;
  problem_title: string | null;
  host_id: string;
  team_id: string | null;
  is_active: boolean;
  max_participants: number;
  created_at: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  is_active: boolean;
  user_stats?: UserStats;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeNum: number;
  points: number;
}

export interface AvatarIcon {
  id: string;
  icon: any;
  color: string;
}