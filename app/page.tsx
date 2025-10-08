// app/(dashboard)/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserData } from '@/lib/hooks/useUserData';
import LoginScreen from '@/components/auth/LoginSreen';
import Header from '@/components/dashboard/Header';
import Navigation from '@/components/dashboard/Navigation';
import RaceTrack from '@/components/dashboard/RaceTrack';
import WeeklyStreak from '@/components/dashboard/WeeklyStreak';
import StatsCards from '@/components/dashboard/StatsCard';
import ProblemsTab from '@/components/problems/ProblemTab';
import LeaderboardTab from '@/components/leaderboard/Leaderboard';
import ProfileTab from '@/components/profile/ProfileTab';
import RevisionTab from '@/components/revision/RevisionTab';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    userStats,
    solvedProblems,
    leaderboard,
    revisionProblems,
    toggleRevisionStatus,
    weeklyStreak,
    loadUserData,
    updateProblemStatus,
    updateAvatar,
    updateName
  } = useUserData(user?.id);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAvatar, setSelectedAvatar] = useState('user');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  useEffect(() => {
    if (userStats?.avatar) {
      setSelectedAvatar(userStats.avatar);
    }
  }, [userStats]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <RaceTrack 
              solvedCount={userStats?.solved_count || 0}
              avatar={selectedAvatar}
            />
            <WeeklyStreak 
              streak={userStats?.streak || 0}
              weeklyStreak={weeklyStreak}
            />
            <StatsCards 
              stats={userStats}
              rank={leaderboard.findIndex(u => u.user_id === user.id) + 1}
            />
          </motion.div>
        );
      
      case 'problems':
        return (
          <ProblemsTab 
            solvedProblems={solvedProblems}
            revisionProblems={revisionProblems}
            toggleRevisionStatus={toggleRevisionStatus}
            onProblemToggle={updateProblemStatus}
            leetcodeUsername={userStats?.leetcode_username}
          />
        );
      
      case 'leaderboard':
        return (
          <LeaderboardTab 
            leaderboard={leaderboard}
            currentUserId={user.id}
          />
        );
      
      case 'profile':
        return (
          <ProfileTab 
            user={user}
            userStats={userStats}
            leaderboard={leaderboard}
            selectedAvatar={selectedAvatar}
            onAvatarChange={updateAvatar}
            onNameChange={updateName}
          />
        );
      
      case 'revision':
        return (
          <RevisionTab 
            revisionProblems={revisionProblems}
            leetcodeUsername={userStats?.leetcode_username}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        user={user}
        userStats={userStats}
        leaderboard={leaderboard}
        selectedAvatar={selectedAvatar}
        onAvatarChange={updateAvatar}
        onSignOut={signOut}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}