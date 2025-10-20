// lib/services/notificationService.ts - COMPLETE VERSION
import { supabase } from '@/lib/supabase/client';

interface NotificationPayload {
  from_user_id: string;
  to_user_id: string;
  type: string;
  content: string;
  team_id?: string;
  race_id?: string;
}

// ============================================
// FETCH NOTIFICATIONS
// ============================================
export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      from_user:from_user_id(
        user_stats!inner(name, avatar)
      ),
      teams(team_name, avatar)
    `)
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return (data || []).map(notif => ({
    ...notif,
    user_stats: notif.from_user?.[0]?.user_stats || { name: 'Unknown', avatar: 'user' }
  }));
};

export const getUnreadCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }

  return count || 0;
};

// ============================================
// MARK AS READ
// ============================================
export const markAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) throw error;
};

export const markAllAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq('to_user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
};

export const deleteNotification = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
};

// ============================================
// REAL-TIME SUBSCRIPTION
// ============================================
export const subscribeToNotifications = (
  userId: string,
  onNotification: (notification: any) => void
) => {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `to_user_id=eq.${userId}`
      },
      async (payload) => {
        // Fetch the complete notification with user stats
        const { data } = await supabase
          .from('notifications')
          .select(`
            *,
            from_user:from_user_id(
              user_stats!inner(name, avatar)
            ),
            teams(team_name, avatar)
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          const formattedNotification = {
            ...data,
            user_stats: data.from_user?.[0]?.user_stats || { name: 'Unknown', avatar: 'user' }
          };
          onNotification(formattedNotification);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ============================================
// SEND NOTIFICATIONS
// ============================================

// Team Invite
export const sendTeamInvite = async (
  toUserId: string,
  teamId: string,
  fromUserId: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      type: 'team_invite',
      team_id: teamId,
      content: 'invited you to join their team',
      is_read: false
    });

  if (error) throw error;
};

// Team Accepted
export const sendTeamAccepted = async (
  toUserId: string,
  teamId: string,
  fromUserId: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      type: 'team_accepted',
      team_id: teamId,
      content: 'accepted your team invitation',
      is_read: false
    });

  if (error) throw error;
};

// Follow Request (if you want to require approval)
export const sendFollowRequest = async (
  toUserId: string,
  fromUserId: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      type: 'follow_request',
      content: 'wants to follow you',
      is_read: false
    });

  if (error) throw error;
};

// Follow Notification (instant follow, no approval needed)
export const sendFollowNotification = async (
  toUserId: string,
  fromUserId: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      type: 'new_follower',
      content: 'started following you',
      is_read: false
    });

  if (error) throw error;
};

// Follow Back Notification
export const sendFollowBackNotification = async (
  toUserId: string,
  fromUserId: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      type: 'follow_back',
      content: 'followed you back',
      is_read: false
    });

  if (error) throw error;
};

// Race Invite
export const sendRaceInvite = async (
  toUserId: string,
  raceId: string,
  fromUserId: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      type: 'race_invite',
      race_id: raceId,
      content: 'invited you to join a race',
      is_read: false
    });

  if (error) throw error;
};

// Race Started
export const sendRaceStarted = async (
  teamId: string,
  raceId: string,
  fromUserId: string
) => {
  // Get all team members except the creator
  const { data: members } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .neq('user_id', fromUserId);

  if (!members) return;

  const notifications = members.map(member => ({
    from_user_id: fromUserId,
    to_user_id: member.user_id,
    type: 'race_started',
    race_id: raceId,
    team_id: teamId,
    content: 'started a new race',
    is_read: false
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) throw error;
};

// Member Joined Team
export const sendMemberJoined = async (
  teamId: string,
  newMemberId: string,
  newMemberName: string
) => {
  // Get all team members except the new member
  const { data: members } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .neq('user_id', newMemberId);

  if (!members) return;

  const notifications = members.map(member => ({
    from_user_id: newMemberId,
    to_user_id: member.user_id,
    type: 'member_joined',
    team_id: teamId,
    content: 'joined the team',
    is_read: false
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) throw error;
};

// Achievement Unlocked
export const sendAchievementNotification = async (
  userId: string,
  achievementName: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: userId,
      to_user_id: userId,
      type: 'achievement',
      content: `unlocked "${achievementName}"`,
      is_read: false
    });

  if (error) throw error;
};

// Rank Change
export const sendRankChangeNotification = async (
  userId: string,
  newRank: number,
  oldRank: number
) => {
  const direction = newRank < oldRank ? 'up' : 'down';
  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: userId,
      to_user_id: userId,
      type: 'rank_change',
      content: `moved ${direction} to rank #${newRank}`,
      is_read: false
    });

  if (error) throw error;
};