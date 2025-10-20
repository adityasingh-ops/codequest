// components/notifications/NotificationBell.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Users, Trophy, X, Check, XCircle, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { getAvatarComponent } from '@/lib/utils/avatars';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
  from_user_id: string;
  team_id?: string;
  race_id?: string;
  from_user?: {
    name: string;
    avatar: string;
  };
  teams?: {
    team_name: string;
    avatar: string;
  };
}

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
    subscribeToNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        from_user:from_user_id(
          user_stats(name, avatar)
        ),
        teams(team_name, avatar)
      `)
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      const formatted = data.map(n => ({
        ...n,
        from_user: n.from_user?.[0]?.user_stats || { name: 'Unknown', avatar: 'user' },
        teams: n.teams || null
      }));
      setNotifications(formatted);
    }
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `to_user_id=eq.${userId}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('to_user_id', userId)
      .eq('is_read', false);

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleTeamInvite = async (notificationId: string, teamId: string, accept: boolean) => {
    setLoading(true);
    try {
      // Find the invitation
      const { data: invitation } = await supabase
        .from('team_invitations')
        .select('id')
        .eq('team_id', teamId)
        .eq('invited_user_id', userId)
        .eq('status', 'pending')
        .single();

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (accept) {
        // Accept invitation
        await supabase
          .from('team_invitations')
          .update({
            status: 'accepted',
            responded_at: new Date().toISOString()
          })
          .eq('id', invitation.id);

        // Add to team members
        await supabase
          .from('team_members')
          .insert({
            team_id: teamId,
            user_id: userId,
            role: 'member'
          });
      } else {
        // Decline invitation
        await supabase
          .from('team_invitations')
          .update({
            status: 'declined',
            responded_at: new Date().toISOString()
          })
          .eq('id', invitation.id);
      }

      // Mark notification as read
      await markAsRead(notificationId);

      // Remove from UI
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error handling team invite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowRequest = async (notificationId: string, fromUserId: string, accept: boolean) => {
    setLoading(true);
    try {
      if (accept) {
        // Add to followers
        await supabase
          .from('followers')
          .insert({
            follower_id: fromUserId,
            following_id: userId
          });

        // Send acceptance notification
        await supabase
          .from('notifications')
          .insert({
            from_user_id: userId,
            to_user_id: fromUserId,
            type: 'follow_accepted',
            content: 'accepted your follow request'
          });
      }

      // Mark notification as read
      await markAsRead(notificationId);

      // Remove from UI if declined
      if (!accept) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error handling follow request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_invite':
        return <Users className="w-5 h-5 text-cyan-400" />;
      case 'follow_request':
        return <UserPlus className="w-5 h-5 text-blue-400" />;
      case 'race_invite':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-cyan-500/30 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {notifications.map((notification) => {
                      const { IconComponent, color } = getAvatarComponent(notification.from_user?.avatar || 'user');
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 hover:bg-gray-800/50 transition-colors ${
                            !notification.is_read ? 'bg-cyan-500/5' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {getNotificationIcon(notification.type)}
                                  <p className="text-sm text-gray-300">
                                    <span className="font-medium text-white">
                                      {notification.from_user?.name}
                                    </span>
                                    {' '}
                                    {notification.content}
                                  </p>
                                </div>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>

                              {/* Team Name for team invites */}
                              {notification.type === 'team_invite' && notification.teams && (
                                <p className="text-xs text-cyan-400 mt-1">
                                  Team: {notification.teams.team_name}
                                </p>
                              )}

                              {/* Timestamp */}
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </p>

                              {/* Action Buttons */}
                              {notification.type === 'team_invite' && !notification.is_read && (
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => handleTeamInvite(notification.id, notification.team_id!, true)}
                                    disabled={loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    <Check className="w-3 h-3" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleTeamInvite(notification.id, notification.team_id!, false)}
                                    disabled={loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    Decline
                                  </button>
                                </div>
                              )}

                              {notification.type === 'follow_request' && !notification.is_read && (
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => handleFollowRequest(notification.id, notification.from_user_id, true)}
                                    disabled={loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    <Check className="w-3 h-3" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleFollowRequest(notification.id, notification.from_user_id, false)}
                                    disabled={loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}