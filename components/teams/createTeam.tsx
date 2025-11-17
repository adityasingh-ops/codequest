"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, FileText, Users, Trophy, Copy, Check, X, 
  Code2, ExternalLink, Loader2, Filter, Share2 
} from 'lucide-react';
import { useAuth } from '@/lib/providers/AuthProvider';
import { getAvatarComponent } from '@/lib/utils/avatars';
import { getDifficultyColor } from '@/lib/utils/helper';
import { 
  PROBLEM_SETS, 
  PLATFORM_INFO, 
  getProblemsByPlatform} from '@/lib/utils/problemSet';
import {
  createTeamSheet,
  getTeamSheets,
  getSheetProgress,
  toggleProblemSolved,
  getSheetLeaderboard,
  generateTeamJoinCode,
  subscribeToSheetProgress
} from '@/lib/services/teamSheet';

interface TeamSheetManagementProps {
  teamId: string;
  isAdmin: boolean;
}

export default function TeamSheetManagement({ teamId, isAdmin }: TeamSheetManagementProps) {
  const { user } = useAuth();
  const [sheets, setSheets] = useState<any[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<Map<number, any>>(new Map());
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Create sheet form
  const [sheetName, setSheetName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('leetcode');
  const [selectedProblems, setSelectedProblems] = useState<Set<number>>(new Set());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [problemSearch, setProblemSearch] = useState('');

  const platformProblems = useMemo(
    () => getProblemsByPlatform(selectedPlatform),
    [selectedPlatform]
  );

  const filteredSelectionProblems = useMemo(() => {
    const query = problemSearch.trim().toLowerCase();
    if (!query) return platformProblems;
    return platformProblems.filter((problem: any) => {
      const titleMatch = problem.title.toLowerCase().includes(query);
      const numberMatch = String(problem.platformNum).includes(query);
      return titleMatch || numberMatch;
    });
  }, [platformProblems, problemSearch]);

  // Load sheets
  useEffect(() => {
    if (!teamId) return;
    loadSheets();
  }, [teamId]);

  // Load user progress for selected sheet
  useEffect(() => {
    if (!selectedSheet || !user?.id) return;
    loadProgress();
    loadLeaderboard();
  }, [selectedSheet, user?.id]);

  // Real-time subscription
  useEffect(() => {
    if (!selectedSheet) return;

    const unsubscribe = subscribeToSheetProgress(selectedSheet.id, async () => {
      await loadProgress();
      await loadLeaderboard();
    });

    return unsubscribe;
  }, [selectedSheet]);

  const loadSheets = async () => {
    try {
      const data = await getTeamSheets(teamId);
      setSheets(data);
      if (data.length > 0 && !selectedSheet) {
        setSelectedSheet(data[0]);
      }
    } catch (err) {
      console.error('Error loading sheets:', err);
      setError('Failed to load sheets');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!selectedSheet || !user?.id) return;
    try {
      const progress = await getSheetProgress(selectedSheet.id, user.id);
      const progressMap = new Map();
      progress.forEach((p: any) => {
        progressMap.set(p.problem_id, p);
      });
      setUserProgress(progressMap);
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const loadLeaderboard = async () => {
    if (!selectedSheet) return;
    try {
      const data = await getSheetLeaderboard(selectedSheet.id);
      setLeaderboard(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  };

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || selectedProblems.size === 0) {
      setError('Please select at least one problem');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const problems = platformProblems.filter(p => selectedProblems.has(p.id));

      const newSheet = await createTeamSheet(
        teamId,
        sheetName,
        description,
        selectedPlatform,
        problems,
        user.id
      );

      setSheets(prev => [newSheet, ...prev]);
      setSelectedSheet(newSheet);
      setSheetName('');
      setDescription('');
      setSelectedProblems(new Set());
      setShowCreateModal(false);
      setSuccess('Sheet created successfully! 🎉');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create sheet');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProblem = async (problem: any) => {
    if (!user?.id || !selectedSheet) return;

    try {
      await toggleProblemSolved(
        selectedSheet.id,
        user.id,
        problem.id,
        problem.platform,
        problem.points
      );
      await loadProgress();
      await loadLeaderboard();
    } catch (err) {
      console.error('Error toggling problem:', err);
      setError('Failed to update progress');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleGenerateJoinCode = async () => {
    try {
      const code = await generateTeamJoinCode(teamId);
      setJoinCode(code);
      setShowShareModal(true);
    } catch (err) {
      console.error('Error generating join code:', err);
      setError('Failed to generate join code');
    }
  };

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const problems = selectedSheet?.problems || [];
  const filteredProblems = filterDifficulty === 'All' 
    ? problems 
    : problems.filter((p: any) => p.difficulty === filterDifficulty);

  const userSolvedCount = Array.from(userProgress.values()).filter(p => p.solved).length;
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? (userSolvedCount / totalProblems) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sheets List */}
        <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Sheets</h3>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={handleGenerateJoinCode}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white text-sm font-medium transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share Team
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-800 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">Loading...</div>
            ) : sheets.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sheets yet</p>
              </div>
            ) : (
              sheets.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => setSelectedSheet(sheet)}
                  className={`w-full p-4 text-left transition-colors ${
                    selectedSheet?.id === sheet.id
                      ? 'bg-cyan-500/10 border-l-2 border-cyan-500'
                      : 'hover:bg-gray-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {PLATFORM_INFO[sheet.platform as keyof typeof PLATFORM_INFO]?.icon || '📝'}
                    </span>
                    <p className="font-semibold text-white">{sheet.sheet_name}</p>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{sheet.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400">
                      {sheet.problems.length} problems
                    </span>
                    <span className="text-gray-500 capitalize">{sheet.platform}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Sheet Content */}
        {selectedSheet ? (
          <div className="lg:col-span-3 space-y-6">
            {/* Header with Progress */}
            <div className="bg-black rounded-lg border border-cyan-500/30 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {PLATFORM_INFO[selectedSheet.platform as keyof typeof PLATFORM_INFO]?.icon}
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedSheet.sheet_name}
                    </h2>
                  </div>
                  <p className="text-gray-400">{selectedSheet.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${
                  PLATFORM_INFO[selectedSheet.platform as keyof typeof PLATFORM_INFO]?.color
                } text-white`}>
                  {PLATFORM_INFO[selectedSheet.platform as keyof typeof PLATFORM_INFO]?.name}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Your Progress</span>
                  <span className="text-sm font-medium text-cyan-400">
                    {userSolvedCount} / {totalProblems} ({Math.round(progressPercentage)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-black rounded-lg border border-cyan-500/30 p-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400 mr-3">Difficulty:</span>
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterDifficulty === diff
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Problems List */}
            <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Problems ({filteredProblems.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
                {filteredProblems.map((problem: any, index: number) => {
                  const progress = userProgress.get(problem.id);
                  const isSolved = progress?.solved || false;
                  const platformInfo = PLATFORM_INFO[problem.platform as keyof typeof PLATFORM_INFO];

                  return (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-4 flex items-center gap-4 hover:bg-gray-900/50 transition-colors ${
                        isSolved ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleProblem(problem)}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSolved
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-500'
                            : 'border-gray-600 hover:border-cyan-500 hover:scale-110'
                        }`}
                      >
                        {isSolved && <Check className="w-4 h-4 text-white" />}
                      </button>

                      {/* Problem Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 font-mono text-sm">
                            #{problem.platformNum}
                          </span>
                          <span className={`font-medium ${
                            isSolved ? 'text-gray-500 line-through' : 'text-white'
                          }`}>
                            {problem.title}
                          </span>
                        </div>
                      </div>

                      {/* Difficulty & Points */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          getDifficultyColor(problem.difficulty)
                        }`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-cyan-400 font-medium text-sm">
                          {problem.points} pts
                        </span>
                      </div>

                      {/* External Link */}
                      <a
                        href={platformInfo.getUrl(problem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 bg-gradient-to-br ${platformInfo.color} hover:opacity-80 rounded-lg transition-all`}
                      >
                        <ExternalLink className="w-5 h-5 text-white" />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Leaderboard
                </h3>
              </div>

              <div className="divide-y divide-gray-800 max-h-[400px] overflow-y-auto">
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No one has solved any problems yet</p>
                  </div>
                ) : (
                  leaderboard.map((member, index) => {
                    const { IconComponent, color } = getAvatarComponent(member.avatar);
                    const isCurrentUser = member.user_id === user?.id;

                    return (
                      <motion.div
                        key={member.user_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 flex items-center gap-4 ${
                          isCurrentUser ? 'bg-cyan-500/10' : 'hover:bg-gray-900/50'
                        } transition-colors`}
                      >
                        {/* Rank */}
                        <div className="w-8 flex justify-center">
                          {index === 0 ? (
                            <span className="text-2xl">🥇</span>
                          ) : index === 1 ? (
                            <span className="text-2xl">🥈</span>
                          ) : index === 2 ? (
                            <span className="text-2xl">🥉</span>
                          ) : (
                            <span className="text-gray-500 font-semibold">#{index + 1}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        {/* Name */}
                        <div className="flex-1">
                          <p className="font-semibold text-white flex items-center gap-2">
                            {member.name}
                            {isCurrentUser && (
                              <span className="text-xs px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-400">
                            {member.solved_count} problems solved
                          </p>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-cyan-400">
                            {member.total_points}
                          </p>
                          <p className="text-xs text-gray-500">points</p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 bg-black rounded-lg border border-cyan-500/30 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">Select a sheet to view problems</p>
          </div>
        )}
      </div>

      {/* Create Sheet Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black border border-cyan-500/30 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Problem Sheet</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateSheet} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sheet Name *
                    </label>
                    <input
                      type="text"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      placeholder="e.g., Arrays & Strings"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Platform *
                    </label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => {
                        setSelectedPlatform(e.target.value);
                        setSelectedProblems(new Set());
                        setProblemSearch('');
                      }}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="leetcode">LeetCode</option>
                      <option value="codeforces">Codeforces</option>
                      <option value="codechef">CodeChef</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the problem set..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    rows={2}
                  />
                </div>

                {/* Problem Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">
                      Select Problems * ({selectedProblems.size} selected)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const allProblems = platformProblems;
                        if (selectedProblems.size === allProblems.length) {
                          setSelectedProblems(new Set());
                        } else {
                          setSelectedProblems(new Set(allProblems.map(p => p.id)));
                        }
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      {selectedProblems.size === platformProblems.length 
                        ? 'Deselect All' 
                        : 'Select All'}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      value={problemSearch}
                      onChange={(e) => setProblemSearch(e.target.value)}
                      placeholder="Search by LeetCode # or title..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {problemSearch ? 'Filtered' : 'Showing'}{' '}
                      {filteredSelectionProblems.length} problems
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                    {filteredSelectionProblems.length === 0 ? (
                      <p className="text-sm text-gray-500 col-span-2 text-center py-6">
                        No problems match your search.
                      </p>
                    ) : (
                      filteredSelectionProblems.map((problem: any) => (
                        <label
                          key={problem.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedProblems.has(problem.id)
                              ? 'bg-cyan-500/20 border border-cyan-500/50'
                              : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedProblems.has(problem.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedProblems);
                              if (e.target.checked) {
                                newSelected.add(problem.id);
                              } else {
                                newSelected.delete(problem.id);
                              }
                              setSelectedProblems(newSelected);
                            }}
                            className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              #{problem.platformNum} {problem.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {problem.difficulty}
                              </span>
                              <span className="text-xs text-cyan-400">{problem.points} pts</span>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || selectedProblems.size === 0}
                    className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-lg text-white font-medium transition-colors"
                  >
                    {loading ? 'Creating...' : `Create Sheet (${selectedProblems.size} problems)`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black border border-cyan-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Share Team</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400">
                  Share this code with others to let them join your team instantly!
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                    <p className="text-2xl font-bold text-cyan-400 text-center tracking-wider">
                      {joinCode}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyJoinCode}
                    className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition-colors"
                  >
                    {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>

                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm text-center"
                  >
                    ✓ Copied to clipboard!
                  </motion.p>
                )}

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-500">
                    💡 Team members can use this code to join without needing an invitation
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}