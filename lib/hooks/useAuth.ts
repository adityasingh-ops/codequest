// lib/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      setLoading(false);

      // Initialize user stats on first sign in
      if (event === 'SIGNED_IN' && session?.user) {
        await initializeUserStats(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);
  };

  const initializeUserStats = async (user: User) => {
    try {
      // Check if user stats already exist
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingStats) {
        // Get display name from Google metadata
        const displayName = user.user_metadata?.full_name || 
                          user.user_metadata?.name || 
                          user.email?.split('@')[0] || 
                          'User';

        // Create initial user stats
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            name: displayName,
            points: 0,
            streak: 0,
            solved_count: 0,
            solved_problems: [],
            avatar: 'user'
          });
      }
    } catch (error) {
      console.error('Error initializing user stats:', error);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });
    if (error) console.error('Error signing in:', error);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signInWithGoogle, signOut };
};