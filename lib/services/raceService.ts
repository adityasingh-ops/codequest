// lib/services/raceService.ts
import { supabase } from '@/lib/supabase/client';
import { sendRaceCreatedNotification } from './notificationService';
import { RealtimeChannel } from '@supabase/supabase-js';

let raceChannel: RealtimeChannel | null = null;

export const createRace = async (
  teamId: string,
  raceName: string,
  raceTrackId: string,
  createdByUserId: string
) => {
  const { data, error } = await supabase
    .from('races')
    .insert({
      team_id: teamId,
      race_name: raceName,
      race_track_id: raceTrackId,
      created_by: createdByUserId,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  // Add all team members as participants
  const { data: members } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId);

  if (members && members.length > 0) {
    const participants = members.map((member) => ({
      race_id: data.id,
      user_id: member.user_id,
      problems_solved: 0,
      points_earned: 0
    }));

    await supabase
      .from('race_participants')
      .insert(participants);
  }

  // Send notifications
  await sendRaceCreatedNotification(data.id, teamId, createdByUserId);

  return data;
};

export const getRaceDetails = async (raceId: string) => {
  const { data, error } = await supabase
    .from('races')
    .select(`
      *,
      team_tracks(track_name, track_title, weeks),
      teams(team_name),
      race_participants(
        user_id,
        problems_solved,
        points_earned,
        user_stats(name, avatar)
      )
    `)
    .eq('id', raceId)
    .single();

  if (error) throw error;
  return data;
};

export const subscribeToRaceUpdates = (
  raceId: string,
  onUpdate: (data: any) => void
) => {
  if (raceChannel) {
    raceChannel.unsubscribe();
  }

  raceChannel = supabase
    .channel(`race:${raceId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'race_submissions',
        filter: `race_id=eq.${raceId}`
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'race_participants',
        filter: `race_id=eq.${raceId}`
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();

  return () => {
    if (raceChannel) {
      raceChannel.unsubscribe();
    }
  };
};

export const submitProblemToRace = async (
  raceId: string,
  userId: string,
  problemId: number,
  problemLink: string,
  problemTitle: string,
  problemDifficulty: string,
  points: number
) => {
  // Add submission
  const { data: submission, error: submissionError } = await supabase
    .from('race_submissions')
    .insert({
      race_id: raceId,
      user_id: userId,
      problem_id: problemId,
      problem_link: problemLink,
      problem_title: problemTitle,
      problem_difficulty: problemDifficulty,
      points: points
    })
    .select()
    .single();

  if (submissionError) throw submissionError;

  // Update race participant stats
  const { data: currentParticipant } = await supabase
    .from('race_participants')
    .select('problems_solved, points_earned')
    .eq('race_id', raceId)
    .eq('user_id', userId)
    .single();

  if (currentParticipant) {
    const { error: updateError } = await supabase
      .from('race_participants')
      .update({
        problems_solved: (currentParticipant.problems_solved || 0) + 1,
        points_earned: (currentParticipant.points_earned || 0) + points
      })
      .eq('race_id', raceId)
      .eq('user_id', userId);

    if (updateError) throw updateError;
  }

  return submission;
};

export const getRaceLeaderboard = async (raceId: string) => {
  const { data, error } = await supabase
    .from('race_participants')
    .select(`
      user_id,
      problems_solved,
      points_earned,
      joined_at,
      user_stats(name, avatar, leetcode_username)
    `)
    .eq('race_id', raceId)
    .order('points_earned', { ascending: false })
    .order('problems_solved', { ascending: false });

  if (error) throw error;
  return data;
};

export const getTeamRaces = async (teamId: string) => {
  const { data, error } = await supabase
    .from('races')
    .select(`
      *,
      teams(team_name),
      race_participants(count)
    `)
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const endRace = async (raceId: string, endingUserId: string) => {
  // Verify user is race creator
  const { data: race } = await supabase
    .from('races')
    .select('created_by')
    .eq('id', raceId)
    .single();

  if (race?.created_by !== endingUserId) {
    throw new Error('Only race creator can end the race');
  }

  const { error } = await supabase
    .from('races')
    .update({
      status: 'completed',
      end_date: new Date().toISOString()
    })
    .eq('id', raceId);

  if (error) throw error;
};