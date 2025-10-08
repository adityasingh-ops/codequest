// components/leaderboard/LeaderboardTab.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Search, Crown, Medal, ChevronRight, CheckCircle2, Flame } from 'lucide-react';
import { getAvatarComponent } from '@/lib/utils/avatars';

interface LeaderboardTabProps {
  leaderboard: any[];
  currentUserId: string;
}

export default function LeaderboardTab({ leaderboard, currentUserId }: LeaderboardTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaderboard = leaderboard.filter(player => 
    (player.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (player.leetcode_username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-500 font-medium text-lg">#{index + 1}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
                <Trophy className="w-7 h-7 text-yellow-400" />
                Global Leaderboard
              </h2>
              <p className="text-sm text-gray-400 mt-1">Top coders in your community</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Your Rank</p>
              <p className="text-3xl font-semibold text-cyan-400">
                #{leaderboard.findIndex(u => u.user_id === currentUserId) + 1 || '-'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or LeetCode username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          {filteredLeaderboard.map((player, index) => {
            const isCurrentUser = player.user_id === currentUserId;
            const actualIndex = leaderboard.findIndex(u => u.user_id === player.user_id);
            const { IconComponent: PlayerIcon, color: playerColor } = getAvatarComponent(player.avatar || 'user');

            return (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 flex items-center gap-4 ${
                  isCurrentUser ? 'bg-cyan-500/10 border-l-4 border-cyan-500' : 'hover:bg-gray-900/50'
                } transition-colors cursor-pointer`}
              >
                <div className="w-12 flex justify-center">
                  {getRankIcon(actualIndex)}
                </div>

                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${playerColor} flex items-center justify-center ${
                  actualIndex < 3 ? 'ring-2 ring-yellow-400/50' : ''
                }`}>
                  <PlayerIcon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-lg text-white">{player.name || player.user_id}</p>
                    {isCurrentUser && (
                      <span className="px-2 py-0.5 bg-cyan-500 text-xs rounded-full text-white font-medium">You</span>
                    )}
                    {player.leetcode_username && (
                      <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
                        @{player.leetcode_username}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {player.solved_count} solved
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      {player.streak} day streak
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-semibold text-yellow-400">
                      {player.points}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">points</p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}