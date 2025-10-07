// components/battles/BattleCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Swords, Users, Clock, Trophy, Play } from 'lucide-react';
import { Battle } from '@/lib/types/battles.types';

interface BattleCardProps {
  battle: Battle;
  participantCount: number;
  onJoin: () => void;
  onView: () => void;
  canJoin: boolean;
}

export default function BattleCard({ battle, participantCount, onJoin, onView, canJoin }: BattleCardProps) {
  const getStatusColor = () => {
    switch (battle.status) {
      case 'waiting': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'in_progress': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'completed': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{battle.title}</h3>
            <p className="text-sm text-gray-400">{battle.battle_type.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {battle.status.replace('_', ' ')}
        </span>
      </div>

      {battle.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{battle.description}</p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Players</p>
          <p className="font-bold">{participantCount}/{battle.max_participants}</p>
        </div>
        <div className="text-center">
          <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Duration</p>
          <p className="font-bold">{battle.duration_minutes}m</p>
        </div>
        <div className="text-center">
          <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Problems</p>
          <p className="font-bold">{battle.problem_ids.length}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {battle.status === 'waiting' && canJoin && (
          <button
            onClick={onJoin}
            className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Join Battle
          </button>
        )}
        <button
          onClick={onView}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition-colors"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}