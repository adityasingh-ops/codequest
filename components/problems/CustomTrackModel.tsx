"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Filter, Search, Palette, Check, Loader2 } from 'lucide-react';
import { saveCustomTrack } from '@/lib/services/customTrack';
import { getProblemsByPlatform, PLATFORM_INFO } from '@/lib/utils/problemSet';
import { getDifficultyColor } from '@/lib/utils/helper';

type PlatformFilter = 'leetcode' | 'codeforces' | 'codechef';
type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

interface CustomTrackModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

type PlatformProblem = any;

const COLOR_OPTIONS = [
  { value: 'from-purple-500 to-pink-600', label: 'Purple / Pink' },
  { value: 'from-green-500 to-emerald-600', label: 'Green / Emerald' },
  { value: 'from-blue-500 to-indigo-600', label: 'Blue / Indigo' },
  { value: 'from-orange-500 to-red-600', label: 'Orange / Red' },
  { value: 'from-cyan-500 to-blue-600', label: 'Cyan / Blue' }
];

const PLATFORM_FILTERS: { label: string; value: PlatformFilter }[] = [
  { label: 'LeetCode', value: 'leetcode' },
  { label: 'Codeforces', value: 'codeforces' },
  { label: 'CodeChef', value: 'codechef' }
];

const getPointsForProblem = (problem: PlatformProblem) => {
  if (typeof problem.points === 'number') return problem.points;
  switch (problem.difficulty) {
    case 'Easy':
      return 10;
    case 'Medium':
      return 15;
    case 'Hard':
      return 20;
    default:
      return 10;
  }
};

const formatProblemForTrack = (problem: PlatformProblem) => {
  const platformInfo = PLATFORM_INFO[problem.platform as keyof typeof PLATFORM_INFO];

  return {
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    points: getPointsForProblem(problem),
    platform: problem.platform,
    platformNum: problem.platformNum,
    leetcodeNum: problem.platform === 'leetcode' ? problem.platformNum : undefined,
    titleSlug: problem.titleSlug,
    link: platformInfo?.getUrl ? platformInfo.getUrl(problem) : undefined
  };
};

export default function CustomTrackModal({ userId, onClose, onSuccess }: CustomTrackModalProps) {
  // Work like team sheets: only ever load one platform's full list at a time.
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('leetcode');

  const platformProblems = useMemo<PlatformProblem[]>(() => {
    return getProblemsByPlatform(platformFilter) as PlatformProblem[];
  }, [platformFilter]);

  const [trackName, setTrackName] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [trackColor, setTrackColor] = useState('from-purple-500 to-pink-600');
  const [description, setDescription] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblems, setSelectedProblems] = useState<Set<number>>(new Set());
  const [selectedProblemDetails, setSelectedProblemDetails] = useState<
    Map<number, PlatformProblem>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredProblems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return platformProblems.filter((problem) => {
      if (difficultyFilter !== 'All' && problem.difficulty !== difficultyFilter) {
        return false;
      }

      if (!term) return true;

      return (
        problem.title.toLowerCase().includes(term) ||
        String(problem.platformNum).includes(term)
      );
    });
  }, [platformProblems, difficultyFilter, searchTerm]);

  const selectedProblemObjects = useMemo(
    () => Array.from(selectedProblemDetails.values()),
    [selectedProblemDetails]
  );

  const platformBreakdown = useMemo(() => {
    return selectedProblemObjects.reduce<Record<string, number>>((acc, problem) => {
      acc[problem.platform] = (acc[problem.platform] || 0) + 1;
      return acc;
    }, {});
  }, [selectedProblemObjects]);

  const totalPoints = selectedProblemObjects.reduce(
    (sum, problem) => sum + getPointsForProblem(problem),
    0
  );

  const toggleProblem = (problemId: number) => {
    setSelectedProblems((prev) => {
      const next = new Set(prev);
      const exists = next.has(problemId);
      const problem = platformProblems.find((p) => p.id === problemId);

      if (exists) {
        next.delete(problemId);
        setSelectedProblemDetails((prevMap) => {
          const m = new Map(prevMap);
          m.delete(problemId);
          return m;
        });
      } else if (problem) {
        next.add(problemId);
        setSelectedProblemDetails((prevMap) => {
          const m = new Map(prevMap);
          m.set(problemId, problem);
          return m;
        });
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedProblems((prev) => {
      const next = new Set(prev);
      const everySelected =
        filteredProblems.length > 0 &&
        filteredProblems.every((problem) => next.has(problem.id));

      if (everySelected) {
        filteredProblems.forEach((problem) => {
          next.delete(problem.id);
          setSelectedProblemDetails((prevMap) => {
            const m = new Map(prevMap);
            m.delete(problem.id);
            return m;
          });
        });
      } else {
        filteredProblems.forEach((problem) => {
          next.add(problem.id);
          setSelectedProblemDetails((prevMap) => {
            const m = new Map(prevMap);
            m.set(problem.id, problem);
            return m;
          });
        });
      }

      return next;
    });
  };

  const buildWeeksPayload = () => {
    const problemsPerWeek = 10;
    const payload: Record<string, any> = {};

    selectedProblemObjects.forEach((problem, index) => {
      const weekIndex = Math.floor(index / problemsPerWeek);
      const weekKey = `Week ${weekIndex + 1}`;

      if (!payload[weekKey]) {
        payload[weekKey] = {
          title: `Week ${weekIndex + 1}`,
          days: [
            {
              topic: description.trim() || 'Mixed Practice',
              problems: []
            }
          ]
        };
      }

      payload[weekKey].days[0].problems.push(formatProblemForTrack(problem));
    });

    return payload;
  };

  const handleCreateTrack = async () => {
    if (!trackName.trim() || !trackTitle.trim() || selectedProblems.size === 0 || loading) {
      setError('Please fill all required fields and select at least one problem.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const weeks = buildWeeksPayload();

      await saveCustomTrack({
        userId,
        trackName: trackName.trim().toLowerCase(),
        trackTitle: trackTitle.trim(),
        trackColor,
        githubUrl: null,
        weeks
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create track.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSelectedCount = filteredProblems.filter((problem) =>
    selectedProblems.has(problem.id)
  ).length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Build a Custom Track</h2>
            <p className="text-sm text-gray-400">
              Mix LeetCode, Codeforces, and CodeChef problems into a single playlist.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close custom track modal"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Track Name (no spaces) *
              </label>
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value.replace(/\s+/g, '_'))}
                placeholder="my_mix_track"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Title *
              </label>
              <input
                type="text"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                placeholder="🚀 Mixed Platform Grind"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tagline / Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Focus on 2 pointers & DP"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Track Accent
              </label>
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-gray-400" />
                <select
                  value={trackColor}
                  onChange={(e) => setTrackColor(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {COLOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-lg border border-gray-800 p-4 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-gray-400" />
              {PLATFORM_FILTERS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPlatformFilter(option.value)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    platformFilter === option.value
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff as DifficultyFilter)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    difficultyFilter === diff
                      ? 'bg-purple-500/20 border border-purple-400 text-purple-200'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  {diff}
                </button>
              ))}

              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by # or title..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
              <span>
                Showing {filteredProblems.length} problems · {filteredSelectedCount} selected
              </span>
              <button
                type="button"
                onClick={selectAllFiltered}
                className="text-cyan-400 hover:text-cyan-200"
              >
                {filteredProblems.length > 0 && filteredSelectedCount === filteredProblems.length
                  ? 'Deselect filtered'
                  : 'Select filtered'}
              </button>
            </div>
          </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
    {filteredProblems.length === 0 ? (
      <div className="col-span-2 text-center text-gray-500 py-10">
        No problems match your filters.
      </div>
    ) : (
      filteredProblems.map((problem) => {
        const platformMeta =
          PLATFORM_INFO[problem.platform as keyof typeof PLATFORM_INFO];
        const isSelected = selectedProblems.has(problem.id);

        return (
          <label
            key={problem.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
              isSelected
                ? 'bg-cyan-500/10 border-cyan-500'
                : 'bg-gray-900 border-gray-800 hover:border-cyan-500/50'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleProblem(problem.id)}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-white truncate">
                  #{problem.platformNum} {problem.title}
                </p>
                <span className="text-xs text-gray-500 shrink-0">
                  {getPointsForProblem(problem)} pts
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 flex items-center gap-1">
                  <span>{platformMeta?.icon ?? '🧩'}</span>
                  {platformMeta?.name ?? problem.platform}
                </span>
              </div>
            </div>
          </label>
        );
      })
    )}
  </div>

          <div className="bg-black rounded-lg border border-gray-800 p-4 flex flex-wrap items-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Problems Selected</p>
              <p className="text-xl font-bold text-white">{selectedProblems.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Estimated Points</p>
              <p className="text-xl font-bold text-cyan-400">{totalPoints}</p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-sm text-gray-400 mb-1">Platforms</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                {Object.keys(platformBreakdown).length === 0 ? (
                  <span className="text-gray-500">None</span>
                ) : (
                  Object.entries(platformBreakdown).map(([platform, count]) => (
                    <span
                      key={platform}
                      className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 capitalize"
                    >
                      {platform}: {count}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading || selectedProblems.size === 0 || !trackName.trim() || !trackTitle.trim()}
              onClick={handleCreateTrack}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Track
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

