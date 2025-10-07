// lib/hooks/useBattles.ts
import { useState, useEffect } from 'react';
import { Battle, BattleParticipant } from '@/lib/types/battles.types';

export function useBattles() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBattles = async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const response = await fetch(`/api/battles?${params}`);
      const data = await response.json();
      setBattles(data.battles || []);
    } catch (error) {
      console.error('Error fetching battles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBattle = async (battleData: any) => {
    const response = await fetch('/api/battles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(battleData)
    });
    const data = await response.json();
    if (data.battle) {
      setBattles(prev => [data.battle, ...prev]);
      return data.battle;
    }
    throw new Error(data.error || 'Failed to create battle');
  };

  const joinBattle = async (battleId: string) => {
    const response = await fetch(`/api/battles/${battleId}/join`, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.participant;
  };

  const startBattle = async (battleId: string) => {
    const response = await fetch(`/api/battles/${battleId}/start`, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.battle;
  };

  const submitSolution = async (battleId: string, problemId: number, solved: boolean, timeTaken: number) => {
    const response = await fetch(`/api/battles/${battleId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_id: problemId, solved, time_taken_seconds: timeTaken })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.submission;
  };

  useEffect(() => {
    fetchBattles();
  }, []);

  return {
    battles,
    loading,
    fetchBattles,
    createBattle,
    joinBattle,
    startBattle,
    submitSolution
  };
}

export function useBattleDetail(battleId: string) {
  const [battle, setBattle] = useState<Battle | null>(null);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBattleDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/battles/${battleId}`);
      const data = await response.json();
      setBattle(data.battle);
      setParticipants(data.participants || []);
    } catch (error) {
      console.error('Error fetching battle detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (battleId) {
      fetchBattleDetail();
      
      // Poll for updates every 3 seconds during battle
      const interval = setInterval(() => {
        if (battle?.status === 'in_progress') {
          fetchBattleDetail();
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [battleId, battle?.status]);

  return { battle, participants, loading, refetch: fetchBattleDetail };
}