// lib/hooks/useUserData.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useUserData = (userId: string | undefined) => {
  const [userStats, setUserStats] = useState<any>(null);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const [revisionProblems, setRevisionProblems] = useState<Set<number>>(new Set());
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [weeklyStreak, setWeeklyStreak] = useState<any[]>([]);

  // Wrap loadLeaderboard in useCallback FIRST
  const loadLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('points', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }, []); // No dependencies

  const loadUserData = useCallback(async () => {
    if (!userId) {
      console.log('No userId provided');
      return;
    }

    console.log('Loading user data for:', userId);

    try {
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (stats) {
        console.log('User stats loaded:', stats);
        setUserStats(stats);
        setSolvedProblems(new Set(stats.solved_problems || []));
        setRevisionProblems(new Set(stats.revision_problems || []));
      } else {
        console.log('Creating new user stats');
        const { data: { user } } = await supabase.auth.getUser();
        const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

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
      
      if (streakError) {
        console.error('Error loading streak:', streakError);
      } else {
        setWeeklyStreak(streakData || []);
      }

      // Load leaderboard
      await loadLeaderboard();
      
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [userId, loadLeaderboard]); // Now includes loadLeaderboard

  const toggleRevisionStatus = useCallback(async (problemId: number) => {
    if (!userId || !userStats) return;

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
        .eq('user_id', userId);

      if (error) throw error;

      setRevisionProblems(newRevisionProblems);
      setUserStats(prevStats => ({
        ...prevStats,
        revision_problems: Array.from(newRevisionProblems)
      }));
    } catch (error) {
      console.error('Error updating revision status:', error);
      throw error;
    }
  }, [userId, userStats, revisionProblems]);

  const updateWeeklyStreak = useCallback(async () => {
    if (!userId) return;

    const today = new Date();
    const currentWeek = Math.ceil((today.getDate() - today.getDay() + 1) / 7);
    
    const { data: existingWeek } = await supabase
      .from('weekly_streaks')
      .select('*')
      .eq('user_id', userId)
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
          user_id: userId,
          week_number: currentWeek,
          problems_solved: 1
        });
    }
  }, [userId]);

  const updateProblemStatus = useCallback(async (problemId: number, points: number, isVerified: boolean = false) => {
    if (!userId || !userStats) return;

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
        .eq('user_id', userId);

      if (error) throw error;

      if (!isAlreadySolved) {
        await updateWeeklyStreak();
      }

      setSolvedProblems(newSolvedProblems);
      setUserStats({ 
        ...userStats, 
        points: newPoints, 
        solved_count: newSolvedCount,
        last_solved: isAlreadySolved ? userStats.last_solved : new Date().toISOString()
      });
      await loadLeaderboard();
    } catch (error) {
      console.error('Error updating problem status:', error);
      throw error;
    }
  }, [userId, userStats, solvedProblems, updateWeeklyStreak, loadLeaderboard]);

  const updateAvatar = useCallback(async (avatarId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('user_stats')
      .update({ avatar: avatarId })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating avatar:', error);
      return;
    }

    setUserStats(prevStats => ({ ...prevStats, avatar: avatarId }));
  }, [userId]);

  const updateName = useCallback(async (newName: string) => {
    if (!userId || !newName.trim()) {
      console.log('Validation failed: userId or name is empty');
      return false;
    }

    try {
      console.log('Attempting to update name for user:', userId, 'to:', newName.trim());
      
      const { data, error } = await supabase
        .from('user_stats')
        .update({ name: newName.trim() })
        .eq('user_id', userId)
        .select();

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from update');
        return false;
      }

      setUserStats(prevStats => ({
        ...prevStats,
        name: newName.trim()
      }));
      
      await loadLeaderboard();
      
      console.log('Name updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating name:', error);
      return false;
    }
  }, [userId, loadLeaderboard]);

  return {
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
  };
};