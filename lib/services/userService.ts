import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { UserStats } from "../interfaces/User/UserStats";
import toast from 'react-hot-toast';
import { supabase } from "../supabase/client";

export function getUserStats(){
    const {user} = useAuth();
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserStats = async () => {
        try {
            const { data, error } = await supabase.from('user_stats').select('*').eq('user_id', user?.id).single();
            if (error) throw error;
            setUserStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user stats:', error);
            setError('Failed to fetch user stats');
            toast.error('Failed to fetch user stats');
            setLoading(false);
        }
    }

    return { userStats, loading, error, fetchUserStats };
}