// components/revision/RevisionTab.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, BookMarked, ExternalLink } from 'lucide-react';
import { problemData, getDifficultyColor } from '@/lib/utils/constants';

interface RevisionTabProps {
  revisionProblems: Set<number>;
  leetcodeUsername?: string;
}

export default function RevisionTab({ revisionProblems, leetcodeUsername }: RevisionTabProps) {
  const getRevisionByDifficulty = (difficulty: string) => {
    return Array.from(revisionProblems).filter(id => {
      for (const track of Object.values(problemData)) {
        for (const week of Object.values(track.weeks)) {
          for (const day of week.days) {
            const problem = day.problems.find(p => p.id === id);
            if (problem?.difficulty === difficulty) return true;
          }
        }
      }
      return false;
    }).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-black rounded-lg border border-orange-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-orange-400" />
          <div>
            <h2 className="text-2xl font-semibold text-white">Revision Checklist</h2>
            <p className="text-sm text-gray-400">Problems marked for revision</p>
          </div>
        </div>

        {revisionProblems.size === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No problems marked for revision!</p>
            <p className="text-sm text-gray-500 mt-2">Mark problems you want to review later using the bookmark button</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(problemData).map(([trackName, trackData]) => {
              const revisionInTrack: any[] = [];
              
              Object.entries(trackData.weeks).forEach(([weekKey, week]) => {
                week.days.forEach(day => {
                  day.problems.forEach(problem => {
                    if (revisionProblems.has(problem.id)) {
                      revisionInTrack.push({ ...problem, week: weekKey, topic: day.topic });
                    }
                  });
                });
              });

              if (revisionInTrack.length === 0) return null;

              return (
                <div key={trackName} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <h3 className={`font-medium text-lg mb-3 bg-gradient-to-r ${trackData.color} bg-clip-text text-transparent`}>
                    {trackData.title} • {revisionInTrack.length} marked
                  </h3>
                  <div className="space-y-2">
                    {revisionInTrack.map(problem => (
                      <div
                        key={problem.id}
                        className="flex items-center justify-between p-3 bg-black rounded-lg hover:bg-gray-900 transition-colors border border-gray-800"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <BookMarked className="w-5 h-5 text-orange-400" />
                          <div className="flex-1">
                            <p className="font-medium text-white">{problem.title}</p>
                            <p className="text-sm text-gray-400">{problem.week} • {problem.topic}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-cyan-400 font-medium text-sm">{problem.points} pts</span>
                        </div>
                        <a
                          href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 p-2 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Revision Stats */}
        {revisionProblems.size > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-semibold text-orange-400">{revisionProblems.size}</p>
              <p className="text-sm text-gray-400 mt-1">Total Marked</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-semibold text-green-400">{getRevisionByDifficulty('Easy')}</p>
              <p className="text-sm text-gray-400 mt-1">Easy</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-semibold text-yellow-400">{getRevisionByDifficulty('Medium')}</p>
              <p className="text-sm text-gray-400 mt-1">Medium</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-semibold text-red-400">{getRevisionByDifficulty('Hard')}</p>
              <p className="text-sm text-gray-400 mt-1">Hard</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}