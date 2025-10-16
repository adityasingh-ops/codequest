// app/(dashboard)/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/providers/AuthProvider';
import { useUserData } from '@/lib/providers/UserDataProvider';
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
import UserTab from '@/components/Users/UserTab';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    userStats,
    solvedProblems,
    revisionProblems,
    leaderboard,
    OtherUsers,
    weeklyStreak,
    loading: dataLoading,
    error,
    updateProblemStatus,
    toggleRevisionStatus,
    updateAvatar,
    updateName
  } = useUserData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAvatar, setSelectedAvatar] = useState('user');

  useEffect(() => {
    if (userStats?.avatar) {
      setSelectedAvatar(userStats.avatar);
    }
  }, [userStats?.avatar]);

  // Show loading spinner while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  // Show loading while fetching user data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show error if no user stats (shouldn't happen but good fallback)
  if (!userStats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-400">Unable to load user data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
              solvedCount={userStats.solved_count}
              avatar={selectedAvatar}
            />
            <WeeklyStreak 
              streak={userStats.streak}
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
            leetcodeUsername={userStats.leetcode_username}
            userId={user.id}
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
            leetcodeUsername={userStats.leetcode_username}
          />
        );

      case 'users':
        return (
          <UserTab 
            users={OtherUsers}
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