import { UserStats } from "./UserStats";

export interface UserDataContextType {
  userStats: UserStats | null;
  solvedProblems: Set<number>;
  revisionProblems: Set<number>;
  leaderboard: any[];
  user:any[];
  OtherUsers: any[];
  weeklyStreak: any[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateProblemStatus: (problemId: number, points: number) => Promise<void>;
  toggleRevisionStatus: (problemId: number) => Promise<void>;
  updateAvatar: (avatarId: string) => Promise<void>;
  updateName: (newName: string) => Promise<boolean>;
}
