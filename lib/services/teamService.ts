// lib/services/teamService.ts
import { supabase } from '@/lib/supabase/client';
import { sendTeamInvite } from './notificationService';

export const createTeam = async (
  teamName: string,
  creatorId: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('teams')
    .insert({
      team_name: teamName,
      creator_id: creatorId,
      description: description || '',
      avatar: 'users'
    })
    .select()
    .single();

  if (error) throw error;

  // Add creator as team member
  await supabase
    .from('team_members')
    .insert({
      team_id: data.id,
      user_id: creatorId,
      role: 'creator'
    });

  return data;
};

export const getTeamsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      team_id,
      teams(
        id,
        team_name,
        description,
        avatar,
        creator_id,
        created_at
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).map((item: any) => item.teams);
};

export const getTeamDetails = async (teamId: string) => {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      team_members(
        user_id,
        role,
        user_stats(name, avatar, points)
      )
    `)
    .eq('id', teamId)
    .single();

  if (error) throw error;
  return data;
};

export const inviteUserToTeam = async (
  teamId: string,
  userEmail: string,
  invitedByUserId: string
) => {
  // Get user by email
  const { data: userData, error: userError } = await supabase
    .from('user_stats')
    .select('user_id')
    .ilike('email', userEmail)
    .single();

  if (userError || !userData) {
    throw new Error('User not found');
  }

  const toUserId = userData.user_id;

  // Create invitation
  const { data: invitation, error: invitationError } = await supabase
    .from('team_invitations')
    .insert({
      team_id: teamId,
      invited_user_id: toUserId,
      invited_by_id: invitedByUserId,
      status: 'pending'
    })
    .select()
    .single();

  if (invitationError) throw invitationError;

  // Send notification
  await sendTeamInvite(toUserId, teamId, invitedByUserId);

  return invitation;
};

export const acceptTeamInvitation = async (
  invitationId: string,
  userId: string
) => {
  // Update invitation status
  const { data: invitation, error: updateError } = await supabase
    .from('team_invitations')
    .update({
      status: 'accepted',
      responded_at: new Date().toISOString()
    })
    .eq('id', invitationId)
    .select()
    .single();

  if (updateError) throw updateError;

  // Add user to team members
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: invitation.team_id,
      user_id: userId,
      role: 'member'
    });

  if (memberError && memberError.code !== '23505') {
    // 23505 is unique constraint violation, user might already be member
    throw memberError;
  }

  // Send notification to inviter
  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      from_user_id: userId,
      to_user_id: invitation.invited_by_id,
      type: 'team_accepted',
      team_id: invitation.team_id,
      content: `User accepted your team invitation`
    });

  if (notificationError) console.error(notificationError);

  return invitation;
};

export const declineTeamInvitation = async (invitationId: string) => {
  const { error } = await supabase
    .from('team_invitations')
    .update({
      status: 'declined',
      responded_at: new Date().toISOString()
    })
    .eq('id', invitationId);

  if (error) throw error;
};

export const getPendingInvitations = async (userId: string) => {
  const { data, error } = await supabase
    .from('team_invitations')
    .select(`
      *,
      teams(team_name, description, avatar)
    `)
    .eq('invited_user_id', userId)
    .eq('status', 'pending');

  if (error) throw error;
  return data;
};

export const removeTeamMember = async (
  teamId: string,
  userId: string,
  requestingUserId: string
) => {
  // Verify requester is team creator
  const { data: team } = await supabase
    .from('teams')
    .select('creator_id')
    .eq('id', teamId)
    .single();

  if (team?.creator_id !== requestingUserId) {
    throw new Error('Only team creator can remove members');
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);

  if (error) throw error;
};

export const leaveTeam = async (teamId: string, userId: string) => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);

  if (error) throw error;
};