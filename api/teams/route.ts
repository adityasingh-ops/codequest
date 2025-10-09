// app/api/teams/[teamId]/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const supabase = await createServerClient();

    const { data: team, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members (
          id,
          role,
          points_contributed,
          joined_at,
          user_stats!team_members_user_id_fkey (
            user_id,
            name,
            avatar,
            points,
            problems_solved
          )
        )
      `)
      .eq('id', teamId)
      .single();

    if (error) throw error;

    return NextResponse.json({ team });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}