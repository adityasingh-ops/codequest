// components/dashboard/StatsCards.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Medal } from 'lucide-react';

interface StatsCardsProps {
  stats: any;
  rank: number;
}

export default function StatsCards({ stats, rank }: StatsCardsProps) {
  const cards = [
    {
      icon: CheckCircle2,
      value: stats?.solved_count || 0,
      label: 'Problems Solved',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30'
    },
    {
      icon: Trophy,
      value: stats?.points || 0,
      label: 'Total Points',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    },
    {
      icon: Medal,
      value: `#${rank || '-'}`,
      label: 'Global Rank',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-black rounded-lg border ${card.borderColor} p-6 hover:border-opacity-50 transition-all`}
          >
            <Icon className={`w-8 h-8 ${card.iconColor} mb-3`} />
            <p className="text-3xl font-semibold mb-1 text-white">{card.value}</p>
            <p className="text-sm text-gray-400">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}