export interface UserStats {
  user_id: string;
  name: string;
  points: number;
  streak: number;
  solved_count: number;
  solved_problems: number[];
  revision_problems: number[];
  avatar: string;
  leetcode_username?: string;
  last_solved?: string;
}