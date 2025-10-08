// components/dashboard/RaceTrack.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Trophy } from 'lucide-react';
import { getAvatarComponent } from '@/lib/utils/avatars';

interface RaceTrackProps {
  solvedCount: number;
  avatar: string;
}

export default function RaceTrack({ solvedCount, avatar }: RaceTrackProps) {
  const { IconComponent: AvatarIcon, color: avatarColor } = getAvatarComponent(avatar);
  const progress = Math.min((solvedCount / 100) * 100, 95);

  return (
    <div className="bg-black rounded-lg border border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Your Race Progress</h2>
          <p className="text-sm text-gray-400">Keep the momentum going!</p>
        </div>
        <Rocket className="w-10 h-10 text-cyan-400" />
      </div>

      {/* Race Track */}
      <div className="relative h-32 bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800">
        <div className="absolute inset-0 flex items-center">
          {/* Grid lines */}
          <div className="absolute inset-0 flex">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-gray-800/30" />
            ))}
          </div>
          
          {/* Your position */}
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: `${progress}%` }}
            transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
            className="absolute flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-2 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            >
              {solvedCount} solved
            </motion.div>
            <div className={`w-12 h-12 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center border-2 border-white`}>
              <AvatarIcon className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Finish line */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-500">
            <div className="absolute -top-8 -right-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
              <p className="text-xs text-yellow-400 mt-1 font-medium">100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>Start</span>
        <span className="text-cyan-400 font-medium">{progress.toFixed(0)}% Complete</span>
        <span>Goal: 100 problems</span>
      </div>
    </div>
  );
}