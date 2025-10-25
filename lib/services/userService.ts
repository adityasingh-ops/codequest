// lib/services/userStats.service.ts
import { useState, useCallback } from "react";
import { supabase } from "../supabase/client";
import { UserStats } from "../interfaces/User/UserStats";
import toast from 'react-hot-toast';

export function useUserStatsService(userId?: string) {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Initialize or load user stats
     */
    const initializeUserStats = useCallback(async (displayName?: string) => {
        if (!userId) {
            setError('User ID is required');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            // Try to fetch existing stats
            const existingStats = await fetchUserStats();
            
            if (existingStats) {
                return existingStats;
            }

            // Create new stats if they don't exist
            if (displayName) {
                return await createUserStats(displayName);
            }

            // If no display name provided, get from auth user
            const { data: { user: authUser } } = await supabase.auth.getUser();
            const name = authUser?.user_metadata?.full_name || 
                        authUser?.email?.split('@')[0] || 
                        'User';

            return await createUserStats(name);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to initialize user stats';
            console.error('Error initializing user stats:', err);
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Fetch user stats from database
     */
    const fetchUserStats = useCallback(async () => {
        if (!userId) {
            setError('User ID is required');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            setUserStats(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch user stats';
            console.error('Error fetching user stats:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Create new user stats entry
     */
    const createUserStats = useCallback(async (displayName: string) => {
        if (!userId) {
            setError('User ID is required');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const newStats = {
                user_id: userId,
                name: displayName,
                points: 0,
                streak: 0,
                solved_count: 0,
                solved_problems: [],
                revision_problems: [],
                avatar: 'user'
            };

            const { data, error: insertError } = await supabase
                .from('user_stats')
                .insert(newStats)
                .select()
                .single();

            if (insertError) throw insertError;

            setUserStats(data);
            toast.success('User profile created successfully');
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create user stats';
            console.error('Error creating user stats:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Update user avatar
     */
    const updateAvatar = useCallback(async (avatarId: string) => {
        if (!userId) {
            setError('User ID is required');
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const { error: updateError } = await supabase
                .from('user_stats')
                .update({ avatar: avatarId })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            setUserStats(prev => prev ? { ...prev, avatar: avatarId } : null);
            toast.success('Avatar updated successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update avatar';
            console.error('Error updating avatar:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Update user name
     */
    const updateName = useCallback(async (newName: string) => {
        if (!userId || !newName.trim()) {
            setError('User ID and name are required');
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('user_stats')
                .update({ name: newName.trim() })
                .eq('user_id', userId)
                .select();

            if (updateError) throw updateError;
            if (!data || data.length === 0) {
                throw new Error('Failed to update name');
            }

            setUserStats(prev => prev ? { ...prev, name: newName.trim() } : null);
            toast.success('Name updated successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update name';
            console.error('Error updating name:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Update user points and solved count
     */
    const updateStats = useCallback(async (
        points: number,
        solvedCount: number,
        solvedProblems: number[]
    ) => {
        if (!userId) {
            setError('User ID is required');
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const { error: updateError } = await supabase
                .from('user_stats')
                .update({
                    points,
                    solved_count: solvedCount,
                    solved_problems: solvedProblems,
                    last_solved: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            setUserStats(prev => prev ? {
                ...prev,
                points,
                solved_count: solvedCount,
                solved_problems: solvedProblems,
                last_solved: new Date().toISOString()
            } : null);

            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update stats';
            console.error('Error updating stats:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Reset local state
     */
    const resetState = useCallback(() => {
        setUserStats(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        userStats,
        loading,
        error,
        fetchUserStats,
        createUserStats,
        updateAvatar,
        updateName,
        updateStats,
        resetState,
        setUserStats
    };
}