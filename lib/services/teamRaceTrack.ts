// lib/services/teamTrackService.ts
import { supabase } from '@/lib/supabase/client';

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
}

interface TrackWeek {
  [key: string]: {
    title: string;
    days: Array<{
      topic: string;
      problems: Problem[];
    }>;
  };
}

export const createTeamTrack = async (
  teamId: string,
  trackName: string,
  trackTitle: string,
  trackColor: string,
  weeks: TrackWeek,
  createdByUserId: string
) => {
  const { data, error } = await supabase
    .from('team_tracks')
    .insert({
      team_id: teamId,
      track_name: trackName,
      track_title: trackTitle,
      track_color: trackColor,
      weeks: weeks,
      created_by: createdByUserId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTeamTracks = async (teamId: string) => {
  const { data, error } = await supabase
    .from('team_tracks')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteTeamTrack = async (trackId: string, userId: string) => {
  // Verify user created this track
  const { data: track } = await supabase
    .from('team_tracks')
    .select('created_by')
    .eq('id', trackId)
    .single();

  if (track?.created_by !== userId) {
    throw new Error('Only track creator can delete it');
  }

  const { error } = await supabase
    .from('team_tracks')
    .delete()
    .eq('id', trackId);

  if (error) throw error;
};

// Web scraper utility for fetching LeetCode problems
export const fetchLeetcodeProblem = async (problemNumber: number) => {
  try {
    // Using LeetCode API
    const response = await fetch(
      `https://leetcode.com/api/problems/algorithms/`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();
    const problems = data.stat_status_pairs || [];

    const problem = problems.find(
      (p: any) => p.stat.question_id === problemNumber
    );

    if (!problem) {
      throw new Error(`Problem ${problemNumber} not found`);
    }

    return {
      id: problem.stat.question_id,
      title: problem.stat.question__title,
      difficulty: getDifficultyLevel(problem.difficulty.level),
      url: `https://leetcode.com/problems/${problem.stat.question__title_slug}/`,
      slug: problem.stat.question__title_slug
    };
  } catch (error) {
    console.error('Error fetching problem:', error);
    throw error;
  }
};

// Fetch multiple problems
export const fetchLeetcodeProblems = async (problemNumbers: number[]) => {
  try {
    const problems = await Promise.all(
      problemNumbers.map((num) => fetchLeetcodeProblem(num))
    );
    return problems;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

const getDifficultyLevel = (level: number) => {
  switch (level) {
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Hard';
    default:
      return 'Medium';
  }
};

// Import problems from JSON file
export const importProblems = (jsonData: any): TrackWeek => {
  if (!jsonData.weeks) {
    throw new Error('Invalid JSON structure. Missing "weeks" field.');
  }

  return jsonData.weeks;
};

// Export team track as JSON
export const exportTeamTrack = (track: any) => {
  const exportData = {
    trackName: track.track_name,
    trackTitle: track.track_title,
    trackColor: track.track_color,
    weeks: track.weeks
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${track.track_name}_team_track.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};