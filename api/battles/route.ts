// app/api/battles/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    let query = supabase
      .from('battles')
      .select(`
        *,
        battle_participants (count)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ battles: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      battle_type, 
      problem_ids, 
      max_participants,
      duration_minutes 
    } = body;

    const { data: battle, error } = await supabase
      .from('battles')
      .insert({
        title,
        description,
        battle_type: battle_type || '1v1',
        problem_ids,
        max_participants: max_participants || 2,
        duration_minutes: duration_minutes || 30,
        created_by: user.id,
        status: 'waiting'
      })
      .select()
      .single();

    if (error) throw error;

    // Creator joins automatically
    await supabase
      .from('battle_participants')
      .insert({
        battle_id: battle.id,
        user_id: user.id
      });

    return NextResponse.json({ battle });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}