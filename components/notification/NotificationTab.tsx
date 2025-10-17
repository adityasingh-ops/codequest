"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Users, Trophy, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/providers/AuthProvider';
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

export default function NotificationsTab() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load initial notifications
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
      } finally {
        setLoading(false);
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
    try {
      await acceptTeamInvitation(invitationId, user.id);
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await declineTeamInvitation(invitationId);
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_invite':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'team_accepted':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'race_created':
      case 'race_joined':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bell className="w-5 h-5 text-cyan-400" />;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Pending Invitations Section */}
      {pendingInvitations.length > 0 && (
        <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
              <Users className="w-7 h-7 text-blue-400" />
              Team Invitations
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {pendingInvitations.length} pending invitation(s)
            </p>
          </div>

          <div className="divide-y divide-gray-800">
            {pendingInvitations.map((invitation) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {invitation.teams?.team_name}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      You've been invited to join this team
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Section */}
      <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
                <Bell className="w-7 h-7 text-cyan-400" />
                Notifications
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread notification(s)`
                  : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 transition-colors ${
                    notif.is_read
                      ? 'hover:bg-gray-900/30'
                      : 'bg-cyan-500/5 hover:bg-cyan-500/10 border-l-2 border-cyan-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white">
                          {notif.user_stats?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-300 mt-1 break-words">
                          {notif.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(notif.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}