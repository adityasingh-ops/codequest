export interface HeaderProps {
  user: any;
  userStats: any;
  leaderboard: any[];
  selectedAvatar: string;
  onAvatarChange: (avatarId: string) => void;
  onSignOut: () => void;
}