// lib/types/common.types.ts
export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface UserStats {
  id: string;
  user_id: string;
  name: string | null;
  avatar: string;
  points: number;
  streak: number;
  solved_count: number;
  solved_problems: number[];
  leetcode_username: string | null;
  leetcode_stats: any | null;
}