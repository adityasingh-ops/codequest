// lib/services/leaderboard.service.ts
import { useState, useCallback } from "react";
import { supabase } from "../supabase/client";
import toast from 'react-hot-toast';

export interface LeaderboardEntry {
    user_id: string;
    name: string;
    points: number;
    solved_count: number;
    avatar?: string;
    streak?: number;
}

export function useLeaderboardService() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [allUsers, setAllUsers] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Load top users for leaderboard
     */
    const loadLeaderboard = useCallback(async (limit: number = 50) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('user_stats')
                .select('*')
                .order('points', { ascending: false })
                .limit(limit);

            if (fetchError) throw fetchError;

            setLeaderboard(data || []);
            return data || [];
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load leaderboard';
            console.error('Error loading leaderboard:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Load all users (for broader user lists)
     */
    const loadAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('user_stats')
                .select('*')
                .order('points', { ascending: false });

            if (fetchError) throw fetchError;

            setAllUsers(data || []);
            return data || [];
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load users';
            console.error('Error loading users:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get user rank by user ID
     */
    const getUserRank = useCallback((userId: string) => {
        const index = leaderboard.findIndex(user => user.user_id === userId);
        return index !== -1 ? index + 1 : null;
    }, [leaderboard]);

    /**
     * Get top N users
     */
    const getTopUsers = useCallback((count: number = 10) => {
        return leaderboard.slice(0, count);
    }, [leaderboard]);

    /**
     * Find user in leaderboard
     */
    const findUser = useCallback((userId: string) => {
        return leaderboard.find(user => user.user_id === userId);
    }, [leaderboard]);

    /**
     * Refresh leaderboard data
     */
    const refresh = useCallback(async (limit?: number) => {
        await loadLeaderboard(limit);
    }, [loadLeaderboard]);

    /**
     * Reset local state
     */
    const resetState = useCallback(() => {
        setLeaderboard([]);
        setAllUsers([]);
        setError(null);
        setLoading(false);
    }, []);

    return {
        leaderboard,
        allUsers,
        loading,
        error,
        loadLeaderboard,
        loadAllUsers,
        getUserRank,
        getTopUsers,
        findUser,
        refresh,
        resetState
    };
}