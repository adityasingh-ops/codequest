// app/api/battles/[battleId]/start/route.ts
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
    // Verify user is battle creator
    const { data: battle } = await supabase
      .from('battles')
      .select('*')
      .eq('id', params.battleId)
      .eq('created_by', user.id)
      .single();

    if (!battle) {
      return NextResponse.json({ error: 'Unauthorized or battle not found' }, { status: 403 });
    }

    if (battle.status !== 'waiting') {
      return NextResponse.json({ error: 'Battle already started' }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from('battles')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', params.battleId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ battle: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}