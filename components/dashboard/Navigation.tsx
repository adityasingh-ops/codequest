// components/dashboard/Navigation.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Code2, Trophy, User, Brain } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Code2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'revision', label: 'Revision', icon: Brain }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isActive ? (
              <>
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gray-900 rounded-lg border border-cyan-500/50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-black border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"></div>
            )}
            
            <Icon className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}