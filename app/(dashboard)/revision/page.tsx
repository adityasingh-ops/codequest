// app/(dashboard)/revision/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Brain, Target, CheckCircle2, ExternalLink, Trophy, TrendingUp } from 'lucide-react';
import { problemData } from '@/lib/config/problem';
import { getDifficultyColor } from '@/lib/utils/helper';

export default function RevisionPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [solvedProblems, setSolvedProblems] = useState(new Set<number>());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSolvedProblems();
    }
  }, [user]);

  const loadSolvedProblems = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_stats')
      .select('solved_problems')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setSolvedProblems(new Set(data.solved_problems || []));
    }
    setLoading(false);
  };

  const solvedByTrack = Object.entries(problemData).map(([trackName, trackData]) => {
    const solved: any[] = [];

    Object.entries(trackData.weeks).forEach(([weekKey, week]) => {
      week.days.forEach(day => {
        day.problems.forEach(problem => {
          if (solvedProblems.has(problem.id)) {
            solved.push({ ...problem, week: weekKey, topic: day.topic });
          }
        });
      });
    });

    return { trackName, trackData, solved };
  }).filter(track => track.solved.length > 0);

  const totalSolved = solvedProblems.size;
  const easyCount = Array.from(solvedProblems).filter(id => {
    for (const track of Object.values(problemData)) {
      for (const week of Object.values(track.weeks)) {
        for (const day of week.days) {
          const p = day.problems.find((prob: any) => prob.id === id);
          if (p?.difficulty === 'Easy') return true;
        }
      }
    }
    return false;
  }).length;

  const mediumCount = Array.from(solvedProblems).filter(id => {
    for (const track of Object.values(problemData)) {
      for (const week of Object.values(track.weeks)) {
        for (const day of week.days) {
          const p = day.problems.find((prob: any) => prob.id === id);
          if (p?.difficulty === 'Medium') return true;
        }
      }
    }
    return false;
  }).length;

  const hardCount = Array.from(solvedProblems).filter(id => {
    for (const track of Object.values(problemData)) {
      for (const week of Object.values(track.weeks)) {
        for (const day of week.days) {
          const p = day.problems.find((prob: any) => prob.id === id);
          if (p?.difficulty === 'Hard') return true;
        }
      }
    }
    return false;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-400" />
          Revision Checklist
        </h1>
        <p className="text-gray-400">Review and master problems you've already solved</p>
      </div>

      {totalSolved === 0 ? (
        <div className="text-center py-20">
          <Target className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No problems solved yet!</h3>
          <p className="text-gray-400">Start solving problems to build your revision list</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-4xl font-bold text-purple-400">{totalSolved}</p>
              <p className="text-sm text-gray-400 mt-1">Total Solved</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-green-400">{easyCount}</p>
              <p className="text-sm text-gray-400 mt-1">Easy</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-yellow-400">{mediumCount}</p>
              <p className="text-sm text-gray-400 mt-1">Medium</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-red-400">{hardCount}</p>
              <p className="text-sm text-gray-400 mt-1">Hard</p>
            </div>
          </div>

          {/* Solved Problems by Track */}
          <div className="space-y-6">
            {solvedByTrack.map(({ trackName, trackData, solved }, trackIdx) => (
              <motion.div
                key={trackName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: trackIdx * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-6"
              >
                <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${trackData.color} bg-clip-text text-transparent`}>
                  {trackData.title} • {solved.length} solved
                </h3>
                <div className="space-y-3">
                  {solved.map((problem: any, idx: number) => (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        <div className="flex-1">
                          <p className="font-medium">{problem.title}</p>
                          <p className="text-sm text-gray-400">{problem.week} • {problem.topic}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-yellow-400 font-bold">{problem.points} pts</span>
                      </div>
                      
                      <a
                        href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}