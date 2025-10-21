// components/dashboard/Header.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Trophy, Flame, CheckCircle2, LogOut, Bell, Users, Check, X, } from 'lucide-react';
import { getAvatarComponent } from '@/lib/utils/avatars';
import Link from 'next/link';
import AvatarPicker from '../profile/AvatarPicker';
import { HeaderProps } from '@/lib/types/dashboard';
import { 
  getNotifications, 
  subscribeToNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount 
} from '@/lib/services/notificationService';
import {
  acceptTeamInvitation,
  declineTeamInvitation,
  getPendingInvitations
} from '@/lib/services/teamService';

interface Notification {
  id: string;
  from_user_id: string;
  to_user_id: string;
  type: 'team_invite' | 'team_accepted' | 'race_created' | 'race_joined';
  team_id?: string;
  race_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  user_stats?: { name: string; avatar: string };
}

interface TeamInvitation {
  id: string;
  team_id: string;
  invited_user_id: string;
  status: string;
  teams?: { team_name: string; avatar: string };
}

export default function Header({ 
  user, 
  userStats, 
  leaderboard, 
  selectedAvatar, 
  onAvatarChange,
  onSignOut 
}: HeaderProps) {
  
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { IconComponent: CurrentAvatarIcon, color: currentAvatarColor } = getAvatarComponent(selectedAvatar);

  // Load notifications
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        const [notifs, invites, unread] = await Promise.all([
          getNotifications(user.id),
          getPendingInvitations(user.id),
          getUnreadCount(user.id)
        ]);
        setNotifications(notifs);
        setPendingInvitations(invites);
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadData();
  }, [user?.id]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return unsubscribe;
  }, [user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await markAllAsRead(user.id);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await acceptTeamInvitation(invitationId, user.id);
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
      // Refresh notifications
      const invites = await getPendingInvitations(user.id);
      setPendingInvitations(invites);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    setLoading(true);
    try {
      await declineTeamInvitation(invitationId);
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    } catch (error) {
      console.error('Error declining invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_invite':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'team_accepted':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'race_created':
      case 'race_joined':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

 function HeaderTeamsButton() {
  return (
    <Link
      href="/teams"
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-medium transition-all"
    >
      <Users className="w-5 h-5" />
      <span className="hidden sm:inline">Teams</span>
    </Link>
  );
}

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-black border-b border-cyan-500/30 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  CodeQuest
                </h1>
                <p className="text-xs text-gray-500">Race to the Top</p>
              </div>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-4">
               <HeaderTeamsButton />
              <div className="flex items-center gap-6 px-6 py-2 bg-gray-900/50 border border-cyan-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-white">{userStats?.points || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-medium text-white">{userStats?.streak || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">{userStats?.solved_count || 0}</span>
                </div>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.user_metadata?.full_name}</p>
                  <p className="text-xs text-gray-400">
                    Rank #{leaderboard.findIndex(u => u.user_id === user.id) + 1 || '-'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentAvatarColor} flex items-center justify-center border-2 border-cyan-500/50 hover:border-cyan-500 transition-all cursor-pointer`}
                >
                  <CurrentAvatarIcon className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={onSignOut} 
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        show={showAvatarPicker}
        selectedAvatar={selectedAvatar}
        onSelect={(id) => {
          onAvatarChange(id);
          setShowAvatarPicker(false);
        }}
        onClose={() => setShowAvatarPicker(false)}
      />

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 right-4 w-96 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-cyan-500/30 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Pending Invitations */}
              {pendingInvitations.length > 0 && (
                <div className="border-b border-gray-800">
                  <div className="p-3 bg-blue-500/10">
                    <p className="text-sm font-semibold text-blue-400">Team Invitations</p>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {pendingInvitations.map((invitation) => (
                      <div key={invitation.id} className="p-3 hover:bg-gray-800/50">
                        <p className="text-sm font-medium text-white mb-2">
                          {invitation.teams?.team_name}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptInvitation(invitation.id)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 text-xs transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3 h-3" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineInvitation(invitation.id)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-xs transition-colors disabled:opacity-50"
                          >
                            <X className="w-3 h-3" />
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {notifications.slice(0, 10).map((notification) => {
                      const { IconComponent, color } = getAvatarComponent(notification.user_stats?.avatar || 'user');
                      
                      return (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                            !notification.is_read ? 'bg-cyan-500/5 border-l-2 border-cyan-500' : ''
                          }`}
                          onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1">
                                  <p className="text-sm text-gray-300">
                                    <span className="font-medium text-white">
                                      {notification.user_stats?.name || 'User'}
                                    </span>
                                    {' '}
                                    {notification.content}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(notification.created_at)}
                                  </p>
                                </div>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}