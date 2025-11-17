"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Search, Users, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/providers/AuthProvider';
import { sendFollowNotification } from '@/lib/services/notificationService';
import { getAvatarComponent } from '@/lib/utils/avatars';

interface UserProfile {
  user_id: string;
  name: string;
  points: number;
  avatar: string;
  leetcode_username?: string;
  streak?: number;
  solved_count?: number;
}

const normalizeUserStats = (entry: any): UserProfile | null => {
  const rawStats = entry?.user_stats ?? entry;
  const stats = Array.isArray(rawStats) ? rawStats[0] : rawStats;

  if (!stats) {
    return null;
  }

  return {
    user_id: stats.user_id,
    name: stats.name ?? 'Anonymous',
    points: stats.points ?? 0,
    avatar: stats.avatar ?? 'user',
    leetcode_username: stats.leetcode_username ?? '',
    streak: stats.streak ?? 0,
    solved_count: stats.solved_count ?? 0
  };
};

export default function FollowersTab({ activeTab }: { activeTab: 'followers' | 'following' | 'discover' }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [followerIds, setFollowerIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load followers
  const loadFollowers = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          user_stats!followers_follower_id_fkey(*)
        `)
        .eq('following_id', user.id);

      if (error) throw error;
      const followersList =
        data
          ?.map(normalizeUserStats)
          .filter((stats): stats is UserProfile => Boolean(stats)) || [];
      setUsers(followersList);
      setFollowerIds(new Set(followersList.map(u => u.user_id)));
    } catch (err) {
      console.error('Error loading followers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load following
  const loadFollowing = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          following_id,
          user_stats!followers_following_id_fkey(*)
        `)
        .eq('follower_id', user.id);

      if (error) throw error;
      const followingList =
        data
          ?.map(normalizeUserStats)
          .filter((stats): stats is UserProfile => Boolean(stats)) || [];
      setUsers(followingList);
      setFollowingIds(new Set(followingList.map(u => u.user_id)));
    } catch (err) {
      console.error('Error loading following:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load discover (all users except self)
  const loadDiscover = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .neq('user_id', user.id)
        .order('points', { ascending: false });

      if (error) throw error;
      const normalizedUsers =
        data
          ?.map(normalizeUserStats)
          .filter((stats): stats is UserProfile => Boolean(stats)) || [];
      setUsers(normalizedUsers);

      // Load who user is already following
      const { data: followingData } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', user.id);

      setFollowingIds(new Set(followingData?.map(f => f.following_id) || []));

      // Load who follows the user
      const { data: followerData } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', user.id);

      setFollowerIds(new Set(followerData?.map(f => f.follower_id) || []));
    } catch (err) {
      console.error('Error loading discover:', err);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates for followers
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`followers:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'followers',
          filter: `following_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // New follower
            setFollowerIds(prev => new Set(prev).add(payload.new.follower_id));
            if (activeTab === 'followers') {
              loadFollowers();
            }
          } else if (payload.eventType === 'DELETE') {
            // Unfollowed
            setFollowerIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(payload.old.follower_id);
              return newSet;
            });
            if (activeTab === 'followers') {
              loadFollowers();
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'followers',
          filter: `follower_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // User followed someone
            setFollowingIds(prev => new Set(prev).add(payload.new.following_id));
            if (activeTab === 'following') {
              loadFollowing();
            }
          } else if (payload.eventType === 'DELETE') {
            // User unfollowed someone
            setFollowingIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(payload.old.following_id);
              return newSet;
            });
            if (activeTab === 'following') {
              loadFollowing();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, activeTab]);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'followers') {
      loadFollowers();
    } else if (activeTab === 'following') {
      loadFollowing();
    } else {
      loadDiscover();
    }
  }, [activeTab, user?.id]);

  const handleFollow = async (targetUserId: string) => {
    if (!user?.id) return;

    try {
      const isFollowing = followingIds.has(targetUserId);

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;
        setFollowingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(targetUserId);
          return newSet;
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          });

        if (error) throw error;
        setFollowingIds(prev => new Set(prev).add(targetUserId));

        // Send notification
        await sendFollowNotification(targetUserId, user.id);
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
    }
  };

  const filteredUsers = users.filter(player =>
    (player.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (player.leetcode_username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
                <Users className="w-7 h-7 text-white" />
                {activeTab === 'followers' && 'Followers'}
                {activeTab === 'following' && 'Following'}
                {activeTab === 'discover' && 'Discover'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === 'followers' && `${users.length} people following you`}
                {activeTab === 'following' && `${users.length} people you follow`}
                {activeTab === 'discover' && 'Connect with other coders'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or LeetCode username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <p>Loading...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((userItem, index) => {
              const { IconComponent, color } = getAvatarComponent(userItem.avatar || 'user');
              const isFollowing = followingIds.has(userItem.user_id);
              const isFollower = followerIds.has(userItem.user_id);

              return (
                <motion.div
                  key={userItem.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex items-center gap-4 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="w-12 flex justify-center text-gray-500 text-sm">
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white">{userItem.name}</p>
                      {isFollower && (
                        <span className="text-xs px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400">
                          Follows you
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {userItem.leetcode_username || 'No username'}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>🔥 {userItem.streak || 0} streak</span>
                      <span>✓ {userItem.solved_count || 0} solved</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right mr-4">
                    <p className="text-sm font-semibold text-cyan-400">
                      {userItem.points} pts
                    </p>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => handleFollow(userItem.user_id)}
                    className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                      isFollowing
                        ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50'
                        : 'bg-cyan-500 text-white hover:bg-cyan-600'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Follow</span>
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}