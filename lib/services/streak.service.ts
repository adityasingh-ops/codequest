// lib/services/streak.service.ts
import { useState, useCallback } from "react";
import { supabase } from "../supabase/client";
import toast from 'react-hot-toast';

export interface WeeklyStreakEntry {
    id: string;
    user_id: string;
    week_number: number;
    problems_solved: number;
    created_at?: string;
}

export function useStreakService(userId?: string) {
    const [weeklyStreak, setWeeklyStreak] = useState<WeeklyStreakEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Calculate current week number
     */
    const getCurrentWeekNumber = useCallback(() => {
        const today = new Date();
        return Math.ceil((today.getDate() - today.getDay() + 1) / 7);
    }, []);

    /**
     * Load user's weekly streak history
     */
    const loadWeeklyStreak = useCallback(async (limit: number = 12) => {
        if (!userId) {
            setError('User ID is required');
            return [];
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('weekly_streaks')
                .select('*')
                .eq('user_id', userId)
                .order('week_number', { ascending: false })
                .limit(limit);

            if (fetchError) throw fetchError;

            setWeeklyStreak(data || []);
            return data || [];
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load weekly streak';
            console.error('Error loading weekly streak:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Update or create weekly streak entry
     */
    const updateWeeklyStreak = useCallback(async () => {
        if (!userId) {
            setError('User ID is required');
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const currentWeek = getCurrentWeekNumber();

            // Check if entry exists for current week
            const { data: existingWeek, error: fetchError } = await supabase
                .from('weekly_streaks')
                .select('*')
                .eq('user_id', userId)
                .eq('week_number', currentWeek)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (existingWeek) {
                // Update existing week
                const { error: updateError } = await supabase
                    .from('weekly_streaks')
                    .update({ problems_solved: existingWeek.problems_solved + 1 })
                    .eq('id', existingWeek.id);

                if (updateError) throw updateError;
            } else {
                // Create new week entry
                const { error: insertError } = await supabase
                    .from('weekly_streaks')
                    .insert({
                        user_id: userId,
                        week_number: currentWeek,
                        problems_solved: 1
                    });

                if (insertError) throw insertError;
            }

            // Refresh streak data
            await loadWeeklyStreak();
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update weekly streak';
            console.error('Error updating weekly streak:', err);
            setError(errorMessage);
            // Don't show toast for streak errors as they're background operations
            return false;
        } finally {
            setLoading(false);
        }
    }, [userId, getCurrentWeekNumber, loadWeeklyStreak]);

    /**
     * Get current week's problems solved count
     */
    const getCurrentWeekProgress = useCallback(() => {
        const currentWeek = getCurrentWeekNumber();
        const weekData = weeklyStreak.find(w => w.week_number === currentWeek);
        return weekData?.problems_solved || 0;
    }, [weeklyStreak, getCurrentWeekNumber]);

    /**
     * Get total problems solved across all weeks
     */
    const getTotalProblemsAcrossWeeks = useCallback(() => {
        return weeklyStreak.reduce((total, week) => total + week.problems_solved, 0);
    }, [weeklyStreak]);

    /**
     * Get streak statistics
     */
    const getStreakStats = useCallback(() => {
        if (weeklyStreak.length === 0) {
            return {
                totalWeeks: 0,
                totalProblems: 0,
                averagePerWeek: 0,
                currentWeekProgress: 0
            };
        }

        const totalProblems = getTotalProblemsAcrossWeeks();
        const currentWeekProgress = getCurrentWeekProgress();

        return {
            totalWeeks: weeklyStreak.length,
            totalProblems,
            averagePerWeek: Math.round(totalProblems / weeklyStreak.length),
            currentWeekProgress
        };
    }, [weeklyStreak, getTotalProblemsAcrossWeeks, getCurrentWeekProgress]);

    /**
     * Reset local state
     */
    const resetState = useCallback(() => {
        setWeeklyStreak([]);
        setError(null);
        setLoading(false);
    }, []);

    return {
        weeklyStreak,
        loading,
        error,
        loadWeeklyStreak,
        updateWeeklyStreak,
        getCurrentWeekProgress,
        getTotalProblemsAcrossWeeks,
        getStreakStats,
        resetState
    };
}