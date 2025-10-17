// lib/services/notificationService.ts
import { supabase } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

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

let notificationChannel: RealtimeChannel | null = null;

export const subscribeToNotifications = (
  userId: string,
  onNewNotification: (notification: Notification) => void
) => {
  if (notificationChannel) {
    notificationChannel.unsubscribe();
  }

  notificationChannel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `to_user_id=eq.${userId}`
      },
      (payload) => {
        onNewNotification(payload.new as Notification);
      }
    )
    .subscribe();

  return () => {
    if (notificationChannel) {
      notificationChannel.unsubscribe();
    }
  };
};

export const getNotifications = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      user_stats!from_user_id(name, avatar)
    `)
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Notification[];
};

export const markAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const markAllAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('to_user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
};

export const sendTeamInvite = async (
  toUserId: string,
  teamId: string,
  invitedByUserId: string
) => {
  const { data: team } = await supabase
    .from('teams')
    .select('team_name')
    .eq('id', teamId)
    .single();

  const { error } = await supabase
    .from('notifications')
    .insert({
      from_user_id: invitedByUserId,
      to_user_id: toUserId,
      type: 'team_invite',
      team_id: teamId,
      content: `You have been invited to join the team "${team?.team_name}"`
    });

  if (error) throw error;
};

export const sendRaceCreatedNotification = async (
  raceId: string,
  teamId: string,
  createdByUserId: string
) => {
  // Get all team members except creator
  const { data: members } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .neq('user_id', createdByUserId);

  const { data: race } = await supabase
    .from('races')
    .select('race_name')
    .eq('id', raceId)
    .single();

  // Send notifications to all team members
  const notifications = (members || []).map((member) => ({
    from_user_id: createdByUserId,
    to_user_id: member.user_id,
    type: 'race_created',
    race_id: raceId,
    team_id: teamId,
    content: `A new race "${race?.race_name}" has been created in your team`
  }));

  if (notifications.length > 0) {
    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) throw error;
  }
};

export const getUnreadCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
};