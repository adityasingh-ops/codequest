// app/api/battles/[battleId]/submit/route.ts
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
    const body = await request.json();
    const { problem_id, solved, time_taken_seconds } = body;

    // Verify battle is in progress
    const { data: battle } = await supabase
      .from('battles')
      .select('*')
      .eq('id', params.battleId)
      .single();

    if (battle.status !== 'in_progress') {
      return NextResponse.json({ error: 'Battle not in progress' }, { status: 400 });
    }

    // Check if already submitted
    const { data: existing } = await supabase
      .from('battle_submissions')
      .select()
      .eq('battle_id', params.battleId)
      .eq('user_id', user.id)
      .eq('problem_id', problem_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Already submitted this problem' }, { status: 400 });
    }

    // Record submission
    const { data: submission, error: submissionError } = await supabase
      .from('battle_submissions')
      .insert({
        battle_id: params.battleId,
        user_id: user.id,
        problem_id,
        solved,
        time_taken_seconds
      })
      .select()
      .single();

    if (submissionError) throw submissionError;

    // Update participant score if solved
    if (solved) {
      const { data: participant } = await supabase
        .from('battle_participants')
        .select('*')
        .eq('battle_id', params.battleId)
        .eq('user_id', user.id)
        .single();

      if (participant) {
        const newSolvedProblems = [...(participant.problems_solved || []), problem_id];
        const baseScore = 100; // Base points per problem
        const timeBonus = Math.max(0, 50 - Math.floor(time_taken_seconds / 60)); // Faster = more points
        const newScore = participant.score + baseScore + timeBonus;

        await supabase
          .from('battle_participants')
          .update({
            score: newScore,
            problems_solved: newSolvedProblems
          })
          .eq('id', participant.id);
      }
    }

    return NextResponse.json({ submission });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}