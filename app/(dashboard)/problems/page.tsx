// app/(dashboard)/problems/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, ChevronDown, ChevronRight, CheckCircle2, 
  ExternalLink, Filter, TrendingUp 
} from 'lucide-react';
import { problemData } from '@/lib/config/problem';
import { getDifficultyColor } from '@/lib/utils/helper';

export default function ProblemsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [selectedTrack, setSelectedTrack] = useState('Beginner');
  const [expandedWeeks, setExpandedWeeks] = useState(new Set(['Week 1']));
  const [solvedProblems, setSolvedProblems] = useState(new Set<number>());
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setUserStats(data);
      setSolvedProblems(new Set(data.solved_problems || []));
    }
  };

  const handleProblemSolved = async (problemId: number, points: number) => {
    if (!user || !userStats) return;

    setIsLoading(true);

    const isAlreadySolved = solvedProblems.has(problemId);
    const newSolvedProblems = new Set(solvedProblems);

    if (isAlreadySolved) {
      newSolvedProblems.delete(problemId);
    } else {
      newSolvedProblems.add(problemId);
    }

    const pointsChange = isAlreadySolved ? -points : points;
    const newPoints = Math.max(0, userStats.points + pointsChange);
    const newSolvedCount = newSolvedProblems.size;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          points: newPoints,
          solved_count: newSolvedCount,
          solved_problems: Array.from(newSolvedProblems),
          last_solved: isAlreadySolved ? userStats.last_solved : new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSolvedProblems(newSolvedProblems);
      setUserStats({
        ...userStats,
        points: newPoints,
        solved_count: newSolvedCount,
        last_solved: isAlreadySolved ? userStats.last_solved : new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating problem:', error);
      alert('Failed to update. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekKey)) {
        newSet.delete(weekKey);
      } else {
        newSet.add(weekKey);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Code2 className="w-8 h-8 text-blue-500" />
          Problem Sets
        </h1>
        <p className="text-gray-400">Track your progress across different difficulty levels</p>
      </div>

      {/* Track Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(problemData).map(([track, data]) => (
          <button
            key={track}
            onClick={() => setSelectedTrack(track)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedTrack === track
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
            }`}
          >
            <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
              {data.title}
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              {Object.keys(data.weeks).length} weeks • {
                Object.values(data.weeks).reduce((acc, week) => 
                  acc + week.days.reduce((sum, day) => sum + day.problems.length, 0), 0
                )
              } problems
            </p>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${data.color}`}
                style={{ 
                  width: `${Math.min(100, (solvedProblems.size / 100) * 100)}%` 
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {Object.entries(problemData[selectedTrack as keyof typeof problemData].weeks).map(([weekKey, week]) => (
          <div 
            key={weekKey} 
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => toggleWeek(weekKey)}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                {expandedWeeks.has(weekKey) ? 
                  <ChevronDown className="w-6 h-6 text-blue-400" /> : 
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                }
                <div className="text-left">
                  <h3 className="font-bold text-lg">{weekKey}: {week.title}</h3>
                  <p className="text-sm text-gray-400">
                    {week.days.reduce((acc, day) => acc + day.problems.length, 0)} problems
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Progress</p>
                  <p className="font-bold">
                    {week.days.reduce((acc, day) => 
                      acc + day.problems.filter(p => solvedProblems.has(p.id)).length, 0
                    )} / {week.days.reduce((acc, day) => acc + day.problems.length, 0)}
                  </p>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {expandedWeeks.has(weekKey) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  {week.days.map((day, dayIdx) => (
                    <div key={dayIdx} className="border-t border-gray-700">
                      <div className="px-5 py-3 bg-gradient-to-r from-gray-700/50 to-transparent">
                        <p className="font-semibold text-blue-400">{day.topic}</p>
                      </div>
                      <div className="divide-y divide-gray-700/50">
                        {day.problems.map(problem => {
                          const isSolved = solvedProblems.has(problem.id);
                          return (
                            <div
                              key={problem.id}
                              className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors group"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <button
                                  onClick={() => handleProblemSolved(problem.id, problem.points)}
                                  disabled={isLoading}
                                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                                    isSolved
                                      ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/50'
                                      : 'border-gray-600 hover:border-blue-500 group-hover:border-blue-400'
                                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                                  ) : (
                                    isSolved && <CheckCircle2 className="w-5 h-5 text-white" />
                                  )}
                                </button>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-mono text-sm">
                                      #{problem.leetcodeNum}
                                    </span>
                                    <span className={`font-medium ${
                                      isSolved ? 'text-gray-400 line-through' : 'text-white'
                                    }`}>
                                      {problem.title}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                    getDifficultyColor(problem.difficulty)
                                  }`}>
                                    {problem.difficulty}
                                  </span>
                                  <span className="text-yellow-400 font-bold text-sm min-w-[60px] text-right">
                                    +{problem.points} pts
                                  </span>
                                </div>
                              </div>

                              <a
                                href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}