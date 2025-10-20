// lib/utils/helpers.ts
export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'Medium':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'Hard':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}


export const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case 'leetcode':
      return 'from-orange-500 to-yellow-600';
    case 'codeforces':
      return 'from-blue-500 to-cyan-600';
    case 'codechef':
      return 'from-brown-500 to-orange-600';
    case 'hackerrank':
      return 'from-green-500 to-teal-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

export const calculateProgress = (solved: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((solved / total) * 100);
};

export const getRankSuffix = (rank: number): string => {
  if (rank % 100 >= 11 && rank % 100 <= 13) return 'th';
  switch (rank % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateRandomColor = (): string => {
  const colors = [
    'from-red-500 to-pink-600',
    'from-blue-500 to-cyan-600',
    'from-green-500 to-emerald-600',
    'from-yellow-500 to-orange-600',
    'from-purple-500 to-indigo-600',
    'from-pink-500 to-rose-600',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};