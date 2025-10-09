// app/api/battles/[battleId]/join/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { battleId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check battle status and capacity
    const { data: battle } = await supabase
      .from('battles')
      .select('*, battle_participants(count)')
      .eq('id', params.battleId)
      .single();

    if (battle.status !== 'waiting') {
      return NextResponse.json({ error: 'Battle already started' }, { status: 400 });
    }

    const participantCount = battle.battle_participants[0]?.count || 0;
    if (participantCount >= battle.max_participants) {
      return NextResponse.json({ error: 'Battle is full' }, { status: 400 });
    }

    // Check if already joined
    const { data: existing } = await supabase
      .from('battle_participants')
      .select()
      .eq('battle_id', params.battleId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Already joined' }, { status: 400 });
    }

    const { data: participant, error } = await supabase
      .from('battle_participants')
      .insert({
        battle_id: params.battleId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ participant });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}