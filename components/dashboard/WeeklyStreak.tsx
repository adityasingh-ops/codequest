// components/dashboard/WeeklyStreak.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame } from 'lucide-react';

interface WeeklyStreakProps {
  streak: number;
  weeklyStreak: any[];
}

export default function WeeklyStreak({ streak, weeklyStreak }: WeeklyStreakProps) {
  return (
    <div className="bg-black rounded-lg border border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
          <Activity className="w-6 h-6 text-cyan-400" />
          Weekly Streak
        </h3>
        <div className="flex items-center gap-2 text-orange-400">
          <Flame className="w-5 h-5" />
          <span className="font-medium text-lg">{streak} days</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {[...Array(12)].map((_, weekIdx) => {
          const weekData = weeklyStreak.find(w => w.week_number === weekIdx + 1);
          const problemsSolved = weekData?.problems_solved || 0;
          const intensity = Math.min(problemsSolved / 10, 1);
          
          return (
            <motion.div
              key={weekIdx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: weekIdx * 0.05 }}
              className="aspect-square rounded-md relative group cursor-pointer border border-gray-800"
              style={{
                backgroundColor: intensity > 0 
                  ? `rgba(6, 182, 212, ${0.2 + intensity * 0.6})` 
                  : 'rgba(17, 24, 39, 0.5)'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {problemsSolved || ''}
              </div>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-cyan-500/50 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Week {weekIdx + 1}: {problemsSolved} problems
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>Week 1</span>
        <span className="text-cyan-400 font-medium">Current: {streak} days</span>
        <span>Week 12</span>
      </div>
    </div>
  );
}