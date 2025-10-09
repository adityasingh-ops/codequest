// app/api/teams/[teamId]/leave/route.ts
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
    // Check if user is owner
    const { data: team } = await supabase
      .from('teams')
      .select('owner_id')
      .eq('id', params.teamId)
      .single();

    if (team?.owner_id === user.id) {
      return NextResponse.json(
        { error: 'Team owner cannot leave. Transfer ownership or delete the team.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', params.teamId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}