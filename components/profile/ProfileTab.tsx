// components/profile/ProfileTab.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Trophy, Medal, Flame, Zap, ExternalLink, TrendingUp, Users, Edit2, Check, X } from 'lucide-react';
import { getAvatarComponent } from '@/lib/utils/avatars';
import { LeetCodeService } from '@/lib/services/leetcodeService';
import { supabase } from '@/lib/supabase/client';

interface ProfileTabProps {
  user: any;
  userStats: any;
  leaderboard: any[];
  selectedAvatar: string;
  onAvatarChange: (avatarId: string) => void;
  onNameChange: (name: string) => Promise<boolean>;
}

export default function ProfileTab({ 
  user, 
  userStats, 
  leaderboard, 
  selectedAvatar, 
  onAvatarChange,
  onNameChange
}: ProfileTabProps) {
  const [leetcodeUsername, setLeetcodeUsername] = useState(userStats?.leetcode_username || '');
  const [leetcodeStats, setLeetcodeStats] = useState(userStats?.leetcode_stats || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userStats?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);

  const { IconComponent: CurrentAvatarIcon, color: currentAvatarColor } = getAvatarComponent(selectedAvatar);

  const syncLeetCodeProfile = async () => {
    if (!leetcodeUsername.trim()) {
      alert('Please enter a LeetCode username');
      return;
    }

    setIsLoading(true);
    try {
      const stats = await LeetCodeService.fetchUserStats(leetcodeUsername.trim());
      setLeetcodeStats(stats);
      
      await supabase
        .from('user_stats')
        .update({
          leetcode_username: leetcodeUsername.trim(),
          leetcode_stats: stats
        })
        .eq('user_id', user.id);
    } catch (error) {
      alert(`Failed to fetch LeetCode profile. Please verify the username is correct.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === userStats?.name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    const success = await onNameChange(editedName.trim());
    setIsSavingName(false);

    if (success) {
      setIsEditingName(false);
    } else {
      alert('Failed to update name. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userStats?.name || '');
    setIsEditingName(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* User Profile Card */}
      <div className="bg-black rounded-lg border border-cyan-500/30 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentAvatarColor} flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ring-2 ring-cyan-500/50`}>
            <CurrentAvatarIcon className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            {/* Name with Edit */}
            <div className="mb-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-semibold text-white bg-gray-900 border border-cyan-500/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    maxLength={50}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSavingName}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-semibold text-white">{userStats?.name || 'User'}</h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-400 mb-3 text-sm">{user.email}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-lg border border-yellow-500/30">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-medium text-white text-sm">{userStats?.points || 0} points</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/30">
                <Medal className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-white text-sm">Rank #{leaderboard.findIndex(u => u.user_id === user.id) + 1 || '-'}</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-lg border border-orange-500/30">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-white text-sm">{userStats?.streak || 0} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LeetCode Integration */}
      <div className="bg-black rounded-lg border border-orange-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-8 h-8 text-orange-400" />
          <div>
            <h2 className="text-2xl font-semibold text-white">LeetCode Integration</h2>
            <p className="text-sm text-gray-400">Connect your LeetCode profile for verification</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            placeholder="Enter your LeetCode username"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
          <button
            onClick={syncLeetCodeProfile}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Syncing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Sync Profile
              </>
            )}
          </button>
        </div>

        {/* LeetCode Stats Display */}
        {leetcodeStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <p className="text-sm text-gray-400 mb-1">Easy</p>
                <p className="text-3xl font-semibold text-green-400">{leetcodeStats.solved.easy}</p>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                <p className="text-sm text-gray-400 mb-1">Medium</p>
                <p className="text-3xl font-semibold text-yellow-400">{leetcodeStats.solved.medium}</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <p className="text-sm text-gray-400 mb-1">Hard</p>
                <p className="text-3xl font-semibold text-red-400">{leetcodeStats.solved.hard}</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <p className="text-sm text-gray-400 mb-1">Total</p>
                <p className="text-3xl font-semibold text-purple-400">{leetcodeStats.solved.all}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-medium text-white">Ranking</h3>
                </div>
                <p className="text-3xl font-semibold text-cyan-400 mb-1">#{leetcodeStats.ranking?.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Global • {leetcodeStats.reputation} reputation</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h3 className="font-medium text-white">Activity</h3>
                </div>
                <p className="text-3xl font-semibold text-orange-400 mb-1">{leetcodeStats.calendar.streak}</p>
                <p className="text-sm text-gray-400">day streak • {leetcodeStats.calendar.totalActiveDays} total days</p>
              </div>
            </div>

            <a
              href={`https://leetcode.com/${leetcodeStats.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View Full Profile on LeetCode
            </a>
          </motion.div>
        )}

        {!leetcodeStats && !isLoading && (
          <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-gray-800">
            <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No LeetCode profile connected</p>
            <p className="text-sm text-gray-500">Enter your username above to sync your stats</p>
          </div>
        )}
      </div>

      {/* Profile Visibility Note */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-cyan-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-cyan-400 mb-1">Profile Visibility</h3>
            <p className="text-sm text-gray-400">
              Your LeetCode stats are visible to other users. They can view your achievements and progress in the leaderboard.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}