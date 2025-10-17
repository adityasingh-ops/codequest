"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Trophy, Users, ChevronRight } from 'lucide-react';
import { getAvatarComponent } from '@/lib/utils/avatars';
import { getRaceDetails, subscribeToRaceUpdates, getRaceLeaderboard } from '@/lib/services/raceService';

interface RaceTrackProps {
  raceId: string;
  solvedCount: number;
  avatar: string;
}

interface RaceParticipant {
  user_id: string;
  problems_solved: number;
  points_earned: number;
  joined_at: string;
  user_stats?: {
    name: string;
    avatar: string;
    leetcode_username: string;
  };
}

export default function RaceTrackDashboard({ raceId, solvedCount, avatar }: RaceTrackProps) {
  const { IconComponent: AvatarIcon, color: avatarColor } = getAvatarComponent(avatar);
  const [activeTeam, setActiveTeam] = useState('all');
  const [raceData, setRaceData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<RaceParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  // Load race details
  useEffect(() => {
    const loadRace = async () => {
      try {
        const data = await getRaceDetails(raceId);
        setRaceData(data);
        
        const lb = await getRaceLeaderboard(raceId);
        setLeaderboard(lb);
      } catch (error) {
        console.error('Error loading race:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRace();
  }, [raceId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToRaceUpdates(raceId, async () => {
      const lb = await getRaceLeaderboard(raceId);
      setLeaderboard(lb);
    });

    return unsubscribe;
  }, [raceId]);

  const progress = Math.min((solvedCount / 100) * 100, 95);

  if (loading) {
    return (
      <div className="bg-black rounded-lg border border-cyan-500/30 p-6 text-center text-gray-400">
        Loading race data...
      </div>
    );
  }

  if (!raceData) {
    return (
      <div className="bg-black rounded-lg border border-cyan-500/30 p-6 text-center text-gray-400">
        Race not found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Race Header */}
      <div className="bg-black rounded-lg border border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {raceData.race_name}
            </h2>
            <p className="text-gray-400">Team: {raceData.teams?.team_name}</p>
          </div>
          <Rocket className="w-12 h-12 text-cyan-400" />
        </div>

        {/* Your Progress */}
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
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>Start</span>
          <span className="text-cyan-400 font-medium">{progress.toFixed(0)}% Complete</span>
          <span>Goal: 100 problems</span>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold flex items-center gap-2 text-white">
              <Trophy className="w-7 h-7 text-yellow-400" />
              Race Leaderboard
            </h3>
            <div className="text-sm text-gray-400">
              {leaderboard.length} participants
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-800">
          <AnimatePresence>
            {leaderboard.map((participant, index) => (
              <motion.div
                key={participant.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 text-center">
                    {index === 0 && (
                      <Trophy className="w-6 h-6 text-yellow-400 mx-auto" />
                    )}
                    {index === 1 && (
                      <Trophy className="w-6 h-6 text-gray-400 mx-auto" />
                    )}
                    {index === 2 && (
                      <Trophy className="w-6 h-6 text-orange-400 mx-auto" />
                    )}
                    {index > 2 && (
                      <span className="text-lg font-bold text-gray-400">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {participant.user_stats?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {participant.user_stats?.leetcode_username}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-400">Problems</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {participant.problems_solved}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Points</p>
                        <p className="text-lg font-bold text-yellow-400">
                          {participant.points_earned}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}