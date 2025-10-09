// app/api/battles/[battleId]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { battleId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: battle, error: battleError } = await supabase
      .from('battles')
      .select('*')
      .eq('id', params.battleId)
      .single();

    if (battleError) throw battleError;

    const { data: participants, error: participantsError } = await supabase
      .from('battle_participants')
      .select(`
        *,
        user_stats (name, avatar, points)
      `)
      .eq('battle_id', params.battleId)
      .order('score', { ascending: false });

    if (participantsError) throw participantsError;

    return NextResponse.json({ 
      battle,
      participants 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}