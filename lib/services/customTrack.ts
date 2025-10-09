// lib/services/customTracks.ts
import { supabase } from '@/lib/supabase/client';

export interface CustomTrack {
  id: string;
  user_id: string;
  track_name: string;
  track_title: string;
  track_color: string;
  github_url: string | null;
  weeks: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SaveCustomTrackInput {
  userId: string;
  trackName: string;
  trackTitle: string;
  trackColor: string;
  githubUrl: string | null;
  weeks: Record<string, any>;
}

export async function saveCustomTrack(input: SaveCustomTrackInput): Promise<CustomTrack> {
  
  const { data, error } = await supabase
    .from('custom_tracks')
    .insert({
      user_id: input.userId,
      track_name: input.trackName,
      track_title: input.trackTitle,
      track_color: input.trackColor,
      github_url: input.githubUrl,
      weeks: input.weeks
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving custom track:', error);
    throw new Error('Failed to save custom track');
  }
  
  return data;
}

export async function getCustomTracks(userId: string): Promise<CustomTrack[]> {
  
  const { data, error } = await supabase
    .from('custom_tracks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching custom tracks:', error);
    throw new Error('Failed to fetch custom tracks');
  }
  
  return data || [];
}

export async function deleteCustomTrack(trackId: string, userId: string): Promise<void> {
  
  const { error } = await supabase
    .from('custom_tracks')
    .delete()
    .eq('id', trackId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting custom track:', error);
    throw new Error('Failed to delete custom track');
  }
}

export async function updateCustomTrack(
  trackId: string, 
  userId: string, 
  updates: Partial<SaveCustomTrackInput>
): Promise<CustomTrack> {
  
  const { data, error } = await supabase
    .from('custom_tracks')
    .update({
      track_title: updates.trackTitle,
      track_color: updates.trackColor,
      weeks: updates.weeks,
      github_url: updates.githubUrl
    })
    .eq('id', trackId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating custom track:', error);
    throw new Error('Failed to update custom track');
  }
  
  return data;
}