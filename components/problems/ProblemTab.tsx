// components/problems/ProblemsTab.tsx
"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { problemData } from '@/lib/utils/problemData';
import ProblemCard from './ProblemCard';

interface ProblemsTabProps {
  solvedProblems: Set<number>;
  onProblemToggle: (problemId: number, points: number, verified: boolean) => Promise<void>;
  leetcodeUsername?: string;
  revisionProblems: Set<number>;
  toggleRevisionStatus: (problemId: number) => Promise<void>;
}

export default function ProblemsTab({ 
  solvedProblems, 
  onProblemToggle,
  leetcodeUsername ,
  revisionProblems,
  toggleRevisionStatus
}: ProblemsTabProps) {
  const [selectedTrack, setSelectedTrack] = useState('Beginner');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set(['Week 1']));

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Track Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(problemData).map(([track, data]) => (
          <button
            key={track}
            onClick={() => setSelectedTrack(track)}
            className={`relative p-6 rounded-xl border-2 transition-all ${
              selectedTrack === track
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'
            }`}
          >
            {selectedTrack === track && (
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30"></div>
            )}
            <div className="relative">
              <h3 className="text-xl font-bold mb-1 text-white">{data.title}</h3>
              <p className="text-sm text-gray-400">
                {Object.keys(data.weeks).length} weeks
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {Object.entries(problemData[selectedTrack].weeks).map(([weekKey, week]) => (
          <div key={weekKey} className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 hover:from-cyan-500/20 hover:to-blue-500/20 rounded-xl blur transition duration-300"></div>
            
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleWeek(weekKey)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedWeeks.has(weekKey) ? 
                    <ChevronDown className="w-5 h-5 text-cyan-400" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                  <span className="font-bold text-white">{weekKey}: {week.title}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {week.days.reduce((acc, day) => acc + day.problems.length, 0)} problems
                </span>
              </button>

              <AnimatePresence>
                {expandedWeeks.has(weekKey) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {week.days.map((day, dayIdx) => (
                      <div key={dayIdx} className="border-t border-gray-800">
                        <div className="px-4 py-3 bg-gray-800/30">
                          <p className="text-sm font-medium text-gray-300">{day.topic}</p>
                        </div>
                        <div className="divide-y divide-gray-800">
                          {day.problems.map(problem => (
                            <ProblemCard
                              key={problem.id}
                              problem={problem}
                              isSolved={solvedProblems.has(problem.id)}
                              isMarkedForRevision={revisionProblems.has(problem.id)}
                              onToggleRevision={toggleRevisionStatus}
                              onToggle={onProblemToggle}
                              leetcodeUsername={leetcodeUsername}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}