// components/battles/BattleRoom.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ExternalLink, Trophy, Zap } from 'lucide-react';
import { Battle, BattleParticipant } from '@/lib/types/battles.types';

interface BattleRoomProps {
  battle: Battle;
  participants: BattleParticipant[];
  currentUserId: string;
  onSubmitProblem: (problemId: number, solved: boolean, timeTaken: number) => void;
}

export default function BattleRoom({ battle, participants, currentUserId, onSubmitProblem }: BattleRoomProps) {
  const [timeRemaining, setTimeRemaining] = useState(battle.duration_minutes * 60);
  const [problemTimers, setProblemTimers] = useState<{ [key: number]: number }>({});
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (battle.started_at) {
      const startTime = new Date(battle.started_at).getTime();
      const endTime = startTime + battle.duration_minutes * 60 * 1000;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          clearInterval(intervalRef.current!);
        }
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [battle.started_at, battle.duration_minutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentParticipant = participants.find(p => p.user_id === currentUserId);
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);

  const handleProblemClick = (problemId: number) => {
    if (!problemTimers[problemId]) {
      setProblemTimers(prev => ({ ...prev, [problemId]: Date.now() }));
    }
  };

  const handleMarkSolved = (problemId: number) => {
    const startTime = problemTimers[problemId] || Date.now();
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    onSubmitProblem(problemId, true, timeTaken);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Battle Header */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl border border-red-500/30 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{battle.title}</h1>
            <p className="text-gray-400">Battle in progress</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-3xl font-bold mb-1">
              <Clock className="w-8 h-8 text-red-400" />
              <span className={timeRemaining < 300 ? 'text-red-400 animate-pulse' : 'text-white'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <p className="text-sm text-gray-400">Time Remaining</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Problems List */}
        <div className="col-span-2 space-y-4">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Problems</h2>
            <div className="space-y-3">
              {battle.problem_ids.map((problemId, index) => {
                const isSolved = currentParticipant?.problems_solved?.includes(problemId);
                return (
                  <motion.div
                    key={problemId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSolved
                        ? 'bg-green-500/20 border-green-500'
                        : 'bg-gray-700/30 border-gray-600 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {isSolved ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-bold">Problem #{problemId}</p>
                          {problemTimers[problemId] && !isSolved && (
                            <p className="text-sm text-gray-400">
                              Time: {formatTime(Math.floor((Date.now() - problemTimers[problemId]) / 1000))}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isSolved && (
                          <button
                            onClick={() => handleMarkSolved(problemId)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
                          >
                            Mark Solved
                          </button>
                        )}
                        <a
                          href={`https://leetcode.com/problems/${problemId}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleProblemClick(problemId)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Your Stats */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Your Performance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">{currentParticipant?.score || 0}</p>
                <p className="text-sm text-gray-400">Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">
                  {currentParticipant?.problems_solved?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Solved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">
                  #{sortedParticipants.findIndex(p => p.user_id === currentUserId) + 1}
                </p>
                <p className="text-sm text-gray-400">Rank</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Leaderboard */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Live Rankings
          </h2>
          <div className="space-y-3">
            {sortedParticipants.map((participant, index) => {
              const isCurrentUser = participant.user_id === currentUserId;
              return (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg ${
                    isCurrentUser
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-300 text-black' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-gray-700 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">
                        {participant.user_stats?.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {participant.problems_solved?.length || 0} solved
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">{participant.score}</p>
                      <p className="text-xs text-gray-400">pts</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}