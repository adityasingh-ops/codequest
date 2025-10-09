// app/api/teams/[teamId]/join/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { inviteCode } = body;

    // Check if team exists and has space
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*, team_members(count)')
      .eq('id', params.teamId)
      .single();

    if (teamError) throw teamError;

    if (team.member_count >= team.max_members) {
      return NextResponse.json({ error: 'Team is full' }, { status: 400 });
    }

    if (team.is_private && team.invite_code !== inviteCode) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 403 });
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('team_members')
      .select()
      .eq('team_id', params.teamId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 });
    }

    // Add user to team
    const { data: member, error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: params.teamId,
        user_id: user.id,
        role: 'member'
      })
      .select()
      .single();

    if (memberError) throw memberError;

    return NextResponse.json({ member });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}