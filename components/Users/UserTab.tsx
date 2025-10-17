"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Search, Users, UserPlus, UserCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/providers/AuthProvider';

interface UserProfile {
  user_id: string;
  name: string;
  points: number;
  avatar: string;
  leetcode_username?: string;
}

export default function FollowersTab({ activeTab }: { activeTab: 'followers' | 'following' | 'discover' }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load followers
  const loadFollowers = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('followers')
        .select('follower_id, user_stats(*)')
        .eq('following_id', user.id);

      if (error) throw error;
      const followersList = data?.map(f => f.user_stats).filter(Boolean) || [];
      setUsers(followersList);
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
        .select('following_id, user_stats(*)')
        .eq('follower_id', user.id);

      if (error) throw error;
      const followingList = data?.map(f => f.user_stats).filter(Boolean) || [];
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
      setUsers(data || []);

      // Load who user is already following
      const { data: followingData } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', user.id);

      setFollowingIds(new Set(followingData?.map(f => f.following_id) || []));
    } catch (err) {
      console.error('Error loading discover:', err);
    } finally {
      setLoading(false);
    }
  };

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
                {activeTab === 'followers' && 'People following you'}
                {activeTab === 'following' && 'People you follow'}
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
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((userItem, index) => (
              <div
                key={userItem.user_id}
                className="p-4 flex items-center gap-4 hover:bg-gray-900/50 transition-colors"
              >
                <div className="w-12 flex justify-center text-gray-500 text-sm">
                  {index + 1}
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{userItem.name}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {userItem.leetcode_username || 'No username'}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm font-semibold text-cyan-400">
                    {userItem.points} pts
                  </p>
                </div>

                {/* Follow Button */}
                {activeTab === 'discover' && (
                  <button
                    onClick={() => handleFollow(userItem.user_id)}
                    className={`p-2 rounded-lg transition-all ${
                      followingIds.has(userItem.user_id)
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    {followingIds.has(userItem.user_id) ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                  </button>
                )}

                {activeTab !== 'discover' && (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}