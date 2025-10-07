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