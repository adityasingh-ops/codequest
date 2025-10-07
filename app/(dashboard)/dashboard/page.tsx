"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, CheckCircle2, Code2, Users, Medal, Crown, Rocket, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { UserStats } from '@/lib/types/database.types';
import { avatarIcons } from '@/lib/utils/constants';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<UserStats[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await loadUserData(session.user.id);
    }
    setLoading(false);
  };

  const loadUserData = async (userId: string) => {
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (stats) {
      setUserStats(stats);
      setSolvedProblems(new Set(stats.solved_problems || []));
    }

    await loadLeaderboard();
  };

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .order('points', { ascending: false })
      .limit(10);
    
    if (data) setLeaderboard(data);
  };

  const getAvatarComponent = (avatarId: string) => {
    const avatar = avatarIcons.find(a => a.id === avatarId) || avatarIcons[0];
    return { IconComponent: avatar.icon, color: avatar.color };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  if (!user || !userStats) {
    return null;
  }

  const { IconComponent: CurrentAvatarIcon, color: currentAvatarColor } = getAvatarComponent(userStats.avatar);
  const currentRank = leaderboard.findIndex(u => u.user_id === user.id) + 1;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Problems Solved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Solved</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {userStats.solved_count}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((userStats.solved_count / 100) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Total Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Points</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {userStats.points}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-400">Keep climbing!</span>
              </div>
            </div>
          </motion.div>

          {/* Current Rank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <Medal className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Global Rank</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    #{currentRank || '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400">{userStats.streak} day streak</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Race Track Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 rounded-2xl blur-2xl"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Your Race Progress
                </h2>
                <p className="text-gray-400">Chase excellence, one problem at a time</p>
              </div>
              <Rocket className="w-12 h-12 text-cyan-400" />
            </div>

            {/* Race Track */}
            <div className="relative h-32 bg-gradient-to-r from-gray-900/50 via-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-cyan-500/10">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-cyan-500/10" />
                ))}
              </div>
              
              {/* Neon Track Lines */}
              <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              <div className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
              
              {/* Your Position */}
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: `${Math.min((userStats.solved_count / 100) * 100, 95)}%` }}
                transition={{ duration: 1.5, type: 'spring', bounce: 0.3 }}
                className="absolute top-1/2 transform -translate-y-1/2"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 -z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${currentAvatarColor} rounded-full blur-xl opacity-60 animate-pulse`}></div>
                </div>
                
                {/* Info Label */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-cyan-500/30 px-3 py-1 rounded-full whitespace-nowrap"
                >
                  <span className="text-xs font-bold text-cyan-400">{userStats.solved_count} problems</span>
                </motion.div>
                
                {/* Avatar */}
                <div className={`relative w-12 h-12 bg-gradient-to-br ${currentAvatarColor} rounded-full flex items-center justify-center border-2 border-white shadow-2xl`}>
                  <CurrentAvatarIcon className="w-6 h-6 text-white" />
                  
                  {/* Speed Lines */}
                  <motion.div
                    animate={{ x: [-20, 0], opacity: [1, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="absolute right-full mr-1 w-8 h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent"
                  />
                </div>
              </motion.div>

              {/* Finish Line */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 shadow-2xl">
                <div className="absolute -top-10 -left-8 text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  <p className="text-xs text-yellow-400 font-bold">100</p>
                </div>
              </div>

              {/* Checkpoint Markers */}
              {[25, 50, 75].map((checkpoint) => (
                <div
                  key={checkpoint}
                  className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-500/30 to-transparent"
                  style={{ left: `${checkpoint}%` }}
                >
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    {checkpoint}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mini Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-2xl blur-2xl"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Top Performers
              </h3>
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>

            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((player, index) => {
                const { IconComponent: PlayerIcon, color: playerColor } = getAvatarComponent(player.avatar);
                const isCurrentUser = player.user_id === user.id;

                return (
                  <motion.div
                    key={player.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                      isCurrentUser 
                        ? 'bg-cyan-500/10 border border-cyan-500/30' 
                        : 'bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {index === 0 && <Crown className="w-6 h-6 text-yellow-400" />}
                      {index === 1 && <Medal className="w-6 h-6 text-gray-300" />}
                      {index === 2 && <Medal className="w-6 h-6 text-orange-400" />}
                      {index > 2 && <span className="text-gray-500 font-bold">#{index + 1}</span>}
                    </div>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${playerColor} flex items-center justify-center border-2 ${index < 3 ? 'border-yellow-400' : 'border-gray-600'}`}>
                      <PlayerIcon className="w-5 h-5 text-white" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{player.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-400">{player.solved_count} solved</p>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-cyan-400">{player.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}