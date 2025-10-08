// components/dashboard/Header.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Trophy, Flame, CheckCircle2, LogOut } from 'lucide-react';
import { getAvatarComponent } from '@/lib/utils/avatars';
import AvatarPicker from '../profile/AvatarPicker';

interface HeaderProps {
  user: any;
  userStats: any;
  leaderboard: any[];
  selectedAvatar: string;
  onAvatarChange: (avatarId: string) => void;
  onSignOut: () => void;
}

export default function Header({ 
  user, 
  userStats, 
  leaderboard, 
  selectedAvatar, 
  onAvatarChange,
  onSignOut 
}: HeaderProps) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const { IconComponent: CurrentAvatarIcon, color: currentAvatarColor } = 
    getAvatarComponent(selectedAvatar);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-black border-b border-cyan-500/30 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  CodeQuest
                </h1>
                <p className="text-xs text-gray-500">Race to the Top</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 px-6 py-2 bg-gray-900/50 border border-cyan-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-white">{userStats?.points || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-medium text-white">{userStats?.streak || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">{userStats?.solved_count || 0}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.user_metadata?.full_name}</p>
                  <p className="text-xs text-gray-400">
                    Rank #{leaderboard.findIndex(u => u.user_id === user.id) + 1 || '-'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentAvatarColor} flex items-center justify-center border-2 border-cyan-500/50 hover:border-cyan-500 transition-all cursor-pointer`}
                >
                  <CurrentAvatarIcon className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={onSignOut} 
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        show={showAvatarPicker}
        selectedAvatar={selectedAvatar}
        onSelect={(id) => {
          onAvatarChange(id);
          setShowAvatarPicker(false);
        }}
        onClose={() => setShowAvatarPicker(false)}
      />
    </>
  );
}