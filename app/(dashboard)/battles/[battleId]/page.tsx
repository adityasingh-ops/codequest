// app/(dashboard)/battles/[battleId]/page.tsx
'use client';

import { use } from 'react';
import { useBattleDetail } from '@/lib/hooks/useBattles';
import BattleLobby from '@/components/battles/BattleLobby';
import BattleRoom from '@/components/battles/BattleRoom';
import { useRouter } from 'next/navigation';

export default function BattlePage({ params }: { params: Promise<{ battleId: string }> }) {
  const { battleId } = use(params);
  const router = useRouter();
  const { battle, participants, loading } = useBattleDetail(battleId);

  const handleStart = async () => {
    try {
      const response = await fetch(`/api/battles/${battleId}/start`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLeave = () => {
    router.push('/battles');
  };

  const handleSubmit = async (problemId: number, solved: boolean, timeTaken: number) => {
    try {
      await fetch(`/api/battles/${battleId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: problemId,
          solved,
          time_taken_seconds: timeTaken
        })
      });
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Battle not found</p>
      </div>
    );
  }

  const currentUserId = 'user-id'; // Get from auth context

  return (
    <div className="px-4 py-8">
      {battle.status === 'waiting' ? (
        <BattleLobby
          battle={battle}
          participants={participants}
          isCreator={battle.created_by === currentUserId}
          onStart={handleStart}
          onLeave={handleLeave}
        />
      ) : battle.status === 'in_progress' ? (
        <BattleRoom
          battle={battle}
          participants={participants}
          currentUserId={currentUserId}
          onSubmitProblem={handleSubmit}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Battle has ended</p>
        </div>
      )}
    </div>
  );
}