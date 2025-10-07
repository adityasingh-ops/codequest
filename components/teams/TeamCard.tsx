// components/teams/TeamCard.tsx (Enhanced version)
'use client';

import { motion } from 'framer-motion';
import { Users, Trophy, Crown, Lock, Unlock, TrendingUp, Calendar } from 'lucide-react';
import { Team } from '@/lib/types/teams.types';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  onJoin?: () => void;
}

export default function TeamCard({ team, onClick, onJoin }: TeamCardProps) {
  const isFull = team.member_count >= team.max_members;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-6 cursor-pointer hover:border-blue-500 transition-all shadow-lg hover:shadow-blue-500/20"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              {team.name}
              {team.is_private ? (
                <Lock className="w-4 h-4 text-yellow-400" />
              ) : (
                <Unlock className="w-4 h-4 text-green-400" />
              )}
            </h3>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {team.member_count} / {team.max_members} members
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-yellow-400">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{team.total_points.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500">points</p>
        </div>
      </div>

      {team.description && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {team.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          {isFull ? (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">
              Full
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
              Open
            </span>
          )}
          {team.is_private && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
              Private
            </span>
          )}
        </div>
        
        {!isFull && onJoin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Join
          </button>
        )}
      </div>
    </motion.div>
  );
}