// lib/hooks/useUserData.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useUserData = (userId: string | undefined) => {
  const [userStats, setUserStats] = useState<any>(null);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const [revisionProblems, setRevisionProblems] = useState<Set<number>>(new Set());
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [weeklyStreak, setWeeklyStreak] = useState<any[]>([]);

   const loadUserData = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (stats) {
        setUserStats(stats);
        setSolvedProblems(new Set(stats.solved_problems || []));
        setRevisionProblems(new Set(stats.revision_problems || [])); // ADD THIS
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

        const { data: newStats } = await supabase
          .from('user_stats')
          .insert({
            user_id: userId,
            name: displayName,
            points: 0,
            streak: 0,
            solved_count: 0,
            solved_problems: [],
            revision_problems: [], // ADD THIS
            avatar: 'user'
          })
          .select()
          .single();
        setUserStats(newStats);
        setRevisionProblems(new Set()); // ADD THIS
      }

      const { data: streakData } = await supabase
        .from('weekly_streaks')
        .select('*')
        .eq('user_id', userId)
        .order('week_number', { ascending: false })
        .limit(12);
      
      setWeeklyStreak(streakData || []);
      await loadLeaderboard();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [userId]);

  // ADD THIS NEW FUNCTION
  const toggleRevisionStatus = async (problemId: number) => {
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
  };


  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .order('points', { ascending: false })
      .limit(50);
    
    setLeaderboard(data || []);
  };

  const updateProblemStatus = async (problemId: number, points: number, isVerified: boolean = false) => {
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
  };

  const updateWeeklyStreak = async () => {
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
  };

  const updateAvatar = async (avatarId: string) => {
    if (!userId) return;

    await supabase
      .from('user_stats')
      .update({ avatar: avatarId })
      .eq('user_id', userId);

    setUserStats({ ...userStats, avatar: avatarId });
  };
// In lib/hooks/useUserData.ts - replace the updateName function with this:


const updateName = async (newName: string) => {
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

    // Use functional update to avoid stale state
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
};

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