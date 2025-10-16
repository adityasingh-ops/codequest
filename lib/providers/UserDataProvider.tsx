// lib/providers/UserDataProvider.tsx
"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './AuthProvider';

interface UserStats {
  user_id: string;
  name: string;
  points: number;
  streak: number;
  solved_count: number;
  solved_problems: number[];
  revision_problems: number[];
  avatar: string;
  leetcode_username?: string;
  last_solved?: string;
}

interface UserDataContextType {
  userStats: UserStats | null;
  solvedProblems: Set<number>;
  revisionProblems: Set<number>;
  leaderboard: any[];
  user:any[];
  OtherUsers: any[];
  weeklyStreak: any[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateProblemStatus: (problemId: number, points: number) => Promise<void>;
  toggleRevisionStatus: (problemId: number) => Promise<void>;
  updateAvatar: (avatarId: string) => Promise<void>;
  updateName: (newName: string) => Promise<boolean>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const [revisionProblems, setRevisionProblems] = useState<Set<number>>(new Set());
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [OtherUsers, setOtherUsers] = useState<any[]>([]);
  const [weeklyStreak, setWeeklyStreak] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('points', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  }, []);
    const loadUser= useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('points', { ascending: false });
      
      if (error) throw error;
      setOtherUsers(data || []);
    } catch (err) {
      console.error('Error loading Users:', err);
    }
  }, []);



  const loadUserData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading user data for:', userId);

      // Load user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (stats) {
        console.log('User stats found:', stats);
        setUserStats(stats);
        setSolvedProblems(new Set(stats.solved_problems || []));
        setRevisionProblems(new Set(stats.revision_problems || []));
      } else {
        // Create new user stats
        console.log('Creating new user stats');
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const displayName = authUser?.user_metadata?.full_name || 
                           authUser?.email?.split('@')[0] || 
                           'User';

        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: userId,
            name: displayName,
            points: 0,
            streak: 0,
            solved_count: 0,
            solved_problems: [],
            revision_problems: [],
            avatar: 'user'
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        console.log('New user stats created:', newStats);
        setUserStats(newStats);
        setSolvedProblems(new Set());
        setRevisionProblems(new Set());
      }

      // Load weekly streak
      const { data: streakData, error: streakError } = await supabase
        .from('weekly_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('week_number', { ascending: false })
        .limit(12);
      
      if (!streakError) {
        setWeeklyStreak(streakData || []);
      }

      // Load leaderboard
      await loadLeaderboard();
      
      console.log('User data loaded successfully');
    } catch (err: any) {
      console.error('Error loading user data:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [loadLeaderboard]);

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    } else {
      // Reset state when user logs out
      setUserStats(null);
      setSolvedProblems(new Set());
      setRevisionProblems(new Set());
      setLeaderboard([]);
      setOtherUsers([]);
      setWeeklyStreak([]);
      setLoading(false);
    }
  }, [user?.id, loadUserData]);

  const refreshData = useCallback(async () => {
    if (user?.id) {
      await loadUserData(user.id);
    }
  }, [user?.id, loadUserData]);

  const updateWeeklyStreak = useCallback(async () => {
    if (!user?.id) return;

    const today = new Date();
    const currentWeek = Math.ceil((today.getDate() - today.getDay() + 1) / 7);
    
    const { data: existingWeek } = await supabase
      .from('weekly_streaks')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_number', currentWeek)
      .single();

    if (existingWeek) {
      await supabase
        .from('weekly_streaks')
        .update({ problems_solved: existingWeek.problems_solved + 1 })
        .eq('id', existingWeek.id);
    } else {
      await supabase
        .from('weekly_streaks')
        .insert({
          user_id: user.id,
          week_number: currentWeek,
          problems_solved: 1
        });
    }
  }, [user?.id]);

  const updateProblemStatus = useCallback(async (problemId: number, points: number) => {
    if (!user?.id || !userStats) return;

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
          last_solved: isAlreadySolved ? null : new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      if (!isAlreadySolved) {
        await updateWeeklyStreak();
      }

      setSolvedProblems(newSolvedProblems);
      setUserStats(prev => prev ? { 
        ...prev, 
        points: newPoints, 
        solved_count: newSolvedCount,
        last_solved: isAlreadySolved ? prev.last_solved : new Date().toISOString()
      } : null);
      
      await loadLeaderboard();
    } catch (err) {
      console.error('Error updating problem status:', err);
      throw err;
    }
  }, [user?.id, userStats, solvedProblems, updateWeeklyStreak, loadLeaderboard]);

  const toggleRevisionStatus = useCallback(async (problemId: number) => {
    if (!user?.id || !userStats) return;

    const isMarkedForRevision = revisionProblems.has(problemId);
    const newRevisionProblems = new Set(revisionProblems);

    if (isMarkedForRevision) {
      newRevisionProblems.delete(problemId);
    } else {
      newRevisionProblems.add(problemId);
    }

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          revision_problems: Array.from(newRevisionProblems)
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setRevisionProblems(newRevisionProblems);
      setUserStats(prev => prev ? {
        ...prev,
        revision_problems: Array.from(newRevisionProblems)
      } : null);
    } catch (err) {
      console.error('Error updating revision status:', err);
      throw err;
    }
  }, [user?.id, userStats, revisionProblems]);

  const updateAvatar = useCallback(async (avatarId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({ avatar: avatarId })
        .eq('user_id', user.id);

      if (error) throw error;

      setUserStats(prev => prev ? { ...prev, avatar: avatarId } : null);
    } catch (err) {
      console.error('Error updating avatar:', err);
    }
  }, [user?.id]);

  const updateName = useCallback(async (newName: string): Promise<boolean> => {
    if (!user?.id || !newName.trim()) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update({ name: newName.trim() })
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) return false;

      setUserStats(prev => prev ? {
        ...prev,
        name: newName.trim()
      } : null);
      
      await loadLeaderboard();
      return true;
    } catch (err) {
      console.error('Error updating name:', err);
      return false;
    }
  }, [user?.id, loadLeaderboard]);

  const value = {
    userStats,
    solvedProblems,
    revisionProblems,
    leaderboard,
    OtherUsers,
    weeklyStreak,
    loading,
    error,
    refreshData,
    updateProblemStatus,
    toggleRevisionStatus,
    updateAvatar,
    updateName
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}