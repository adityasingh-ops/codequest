// lib/hooks/useTeams.ts
import { useState, useEffect } from 'react';
import { Team, TeamMember } from '@/lib/types/teams.types';
import { createClient } from '@/lib/supabase/client';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTeams = async (search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/api/teams?${params}`);
      const data = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: any) => {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    });
    const data = await response.json();
    if (data.team) {
      setTeams(prev => [data.team, ...prev]);
      return data.team;
    }
    throw new Error(data.error || 'Failed to create team');
  };

  const joinTeam = async (teamId: string, inviteCode?: string) => {
    const response = await fetch(`/api/teams/${teamId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.member;
  };

  const leaveTeam = async (teamId: string) => {
    const response = await fetch(`/api/teams/${teamId}/leave`, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    fetchTeams,
    createTeam,
    joinTeam,
    leaveTeam
  };
}

export function useTeamDetail(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/teams/${teamId}`);
      const data = await response.json();
      setTeam(data.team);
      setMembers(data.team.team_members || []);
    } catch (error) {
      console.error('Error fetching team detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchTeamDetail();
  }, [teamId]);

  return { team, members, loading, refetch: fetchTeamDetail };
}