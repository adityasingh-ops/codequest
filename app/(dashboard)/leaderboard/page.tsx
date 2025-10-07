// app/(dashboard)/leaderboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { 
  Trophy, Crown, Medal, Search, ChevronRight, 
  Users, Flame, CheckCircle2, TrendingUp, Filter
} from 'lucide-react';
import { getAvatarComponent } from '@/lib/config/avatar';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'friends' | 'team'>('all');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .order('points', { ascending: false })
      .limit(100);
    
    setLeaderboard(data || []);
    setLoading(false);
  };

  const viewProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setSelectedProfile(data);
      setShowProfileModal(true);
    }
  };

  const filteredLeaderboard = leaderboard.filter(player =>
    (player.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (player.leetcode_username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-7 h-7 text-yellow-400" />;
    if (index === 1) return <Medal className="w-7 h-7 text-gray-300" />;
    if (index === 2) return <Medal className="w-7 h-7 text-orange-400" />;
    return <span className="text-gray-500 font-bold text-xl">#{index + 1}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl border border-yellow-500/30 p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Global Leaderboard
            </h1>
            <p className="text-gray-400">Top performers in the coding community</p>
          </div>
          {user && (
            <div className="text-right bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Your Rank</p>
              <p className="text-4xl font-bold text-yellow-400">
                #{leaderboard.findIndex(u => u.user_id === user.id) + 1 || '-'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or LeetCode username..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'friends', 'team'].map(filter => (
              <button
                key={filter}
                onClick={() => setFilterType(filter as any)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === filter
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredLeaderboard.map((player, index) => {
              const isCurrentUser = user && player.user_id === user.id;
              const { IconComponent, color } = getAvatarComponent(player.avatar || 'user');
              
              return (
                <motion.div
                  key={player.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => viewProfile(player.user_id)}
                  className={`p-5 flex items-center gap-5 cursor-pointer transition-all ${
                    isCurrentUser
                      ? 'bg-blue-500/10 border-l-4 border-blue-500'
                      : 'hover:bg-gray-700/30'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-16 flex justify-center">
                    {getRankIcon(index)}
                  </div>

                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center ${
                    index < 3 ? 'ring-4 ring-yellow-400' : ''
                  }`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-lg">{player.name || 'Anonymous'}</p>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 bg-blue-500 text-xs rounded-full font-semibold">
                          You
                        </span>
                      )}
                      {player.leetcode_username && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                          @{player.leetcode_username}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {player.solved_count} solved
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        {player.streak} day streak
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        Level {Math.floor(player.points / 100) + 1}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right mr-4">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <span className="text-3xl font-bold text-yellow-400">
                        {player.points.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">points</p>
                  </div>

                  <ChevronRight className="w-6 h-6 text-gray-500" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowProfileModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {(() => {
                  const { IconComponent, color } = getAvatarComponent(selectedProfile.avatar);
                  return (
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                  <p className="text-gray-400">@{selectedProfile.leetcode_username || 'No LeetCode'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-2xl hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{selectedProfile.solved_count}</p>
                <p className="text-sm text-gray-400 mt-1">Problems Solved</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{selectedProfile.points}</p>
                <p className="text-sm text-gray-400 mt-1">Total Points</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-orange-400">{selectedProfile.streak}</p>
                <p className="text-sm text-gray-400 mt-1">Day Streak</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}