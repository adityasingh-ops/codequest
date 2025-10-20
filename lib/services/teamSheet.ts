// lib/services/teamSheetService.ts
import { supabase } from '@/lib/supabase/client';

export interface TeamSheet {
  id: string;
  team_id: string;
  sheet_name: string;
  description: string;
  platform: string;
  problems: any[];
  created_by: string;
  is_active: boolean;
  created_at: string;
}

export interface SheetProgress {
  id: string;
  sheet_id: string;
  user_id: string;
  problem_id: number;
  platform: string;
  solved: boolean;
  verified: boolean;
  solved_at: string | null;
  points_earned: number;
}

// ============================================
// TEAM SHEET CRUD
// ============================================

export const createTeamSheet = async (
  teamId: string,
  sheetName: string,
  description: string,
  platform: string,
  problems: any[],
  createdBy: string
) => {
  const { data, error } = await supabase
    .from('team_sheets')
    .insert({
      team_id: teamId,
      sheet_name: sheetName,
      description,
      platform,
      problems,
      created_by: createdBy,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTeamSheets = async (teamId: string) => {
  const { data, error } = await supabase
    .from('team_sheets')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getSheetDetails = async (sheetId: string) => {
  const { data, error } = await supabase
    .from('team_sheets')
    .select('*')
    .eq('id', sheetId)
    .single();

  if (error) throw error;
  return data;
};

export const updateTeamSheet = async (
  sheetId: string,
  updates: Partial<TeamSheet>
) => {
  const { data, error } = await supabase
    .from('team_sheets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', sheetId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTeamSheet = async (sheetId: string) => {
  const { error } = await supabase
    .from('team_sheets')
    .update({ is_active: false })
    .eq('id', sheetId);

  if (error) throw error;
};

// ============================================
// PROGRESS TRACKING
// ============================================

export const getSheetProgress = async (sheetId: string, userId: string) => {
  const { data, error } = await supabase
    .from('team_sheet_progress')
    .select('*')
    .eq('sheet_id', sheetId)
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

export const getAllMembersProgress = async (sheetId: string) => {
  const { data, error } = await supabase
    .from('team_sheet_progress')
    .select(`
      *,
      user_stats!team_sheet_progress_user_id_fkey(name, avatar)
    `)
    .eq('sheet_id', sheetId);

  if (error) throw error;
  return data || [];
};

export const toggleProblemSolved = async (
  sheetId: string,
  userId: string,
  problemId: number,
  platform: string,
  points: number,
  verified: boolean = false
) => {
  // Check if progress exists
  const { data: existing } = await supabase
    .from('team_sheet_progress')
    .select('*')
    .eq('sheet_id', sheetId)
    .eq('user_id', userId)
    .eq('problem_id', problemId)
    .maybeSingle();

  if (existing) {
    // Toggle solved status
    const { data, error } = await supabase
      .from('team_sheet_progress')
      .update({
        solved: !existing.solved,
        verified: !existing.solved ? verified : false,
        solved_at: !existing.solved ? new Date().toISOString() : null,
        points_earned: !existing.solved ? points : 0
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new progress entry
    const { data, error } = await supabase
      .from('team_sheet_progress')
      .insert({
        sheet_id: sheetId,
        user_id: userId,
        problem_id: problemId,
        platform,
        solved: true,
        verified,
        solved_at: new Date().toISOString(),
        points_earned: points
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================
// LEADERBOARD
// ============================================

export const getSheetLeaderboard = async (sheetId: string) => {
  const { data, error } = await supabase
    .from('team_sheet_progress')
    .select(`
      user_id,
      user_stats!team_sheet_progress_user_id_fkey(name, avatar)
    `)
    .eq('sheet_id', sheetId)
    .eq('solved', true);

  if (error) throw error;

  // Aggregate by user
  const leaderboard = (data || []).reduce((acc: any[], curr: any) => {
    const existing = acc.find(item => item.user_id === curr.user_id);
    if (existing) {
      existing.solved_count += 1;
      existing.total_points += curr.points_earned || 0;
    } else {
      acc.push({
        user_id: curr.user_id,
        name: curr.user_stats?.name || 'Unknown',
        avatar: curr.user_stats?.avatar || 'user',
        solved_count: 1,
        total_points: curr.points_earned || 0
      });
    }
    return acc;
  }, []);

  return leaderboard.sort((a, b) => b.solved_count - a.solved_count || b.total_points - a.total_points);
};

// ============================================
// JOIN CODE MANAGEMENT
// ============================================

export const generateTeamJoinCode = async (teamId: string) => {
  // Check if code already exists
  const { data: existing } = await supabase
    .from('team_join_codes')
    .select('*')
    .eq('team_id', teamId)
    .maybeSingle();

  if (existing) {
    return existing.join_code;
  }

  // Generate new code
  const { data, error } = await supabase.rpc('generate_join_code');
  
  if (error) throw error;
  
  const joinCode = data;

  // Save to database
  const { error: insertError } = await supabase
    .from('team_join_codes')
    .insert({
      team_id: teamId,
      join_code: joinCode,
      max_uses: null, // Unlimited
      uses_count: 0
    });

  if (insertError) throw insertError;

  return joinCode;
};

export const getTeamByJoinCode = async (joinCode: string) => {
  const { data, error } = await supabase
    .from('team_join_codes')
    .select(`
      team_id,
      teams(*)
    `)
    .eq('join_code', joinCode.toUpperCase())
    .single();

  if (error) throw error;
  return data?.teams;
};

export const joinTeamByCode = async (joinCode: string, userId: string) => {
  // Get team by code
  const { data: codeData, error: codeError } = await supabase
    .from('team_join_codes')
    .select('team_id, max_uses, uses_count')
    .eq('join_code', joinCode.toUpperCase())
    .single();

  if (codeError) throw new Error('Invalid join code');

  // Check if max uses reached
  if (codeData.max_uses && codeData.uses_count >= codeData.max_uses) {
    throw new Error('This join code has reached its maximum uses');
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', codeData.team_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingMember) {
    throw new Error('You are already a member of this team');
  }

  // Add user to team
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: codeData.team_id,
      user_id: userId,
      role: 'member'
    });

  if (memberError) throw memberError;

  // Increment uses count
  await supabase
    .from('team_join_codes')
    .update({ uses_count: codeData.uses_count + 1 })
    .eq('join_code', joinCode.toUpperCase());

  return codeData.team_id;
};

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export const subscribeToSheetProgress = (
  sheetId: string,
  onUpdate: (payload: any) => void
) => {
  const channel = supabase
    .channel(`sheet-progress:${sheetId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'team_sheet_progress',
        filter: `sheet_id=eq.${sheetId}`
      },
      onUpdate
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};