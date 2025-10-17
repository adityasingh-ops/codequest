"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  X,
  Upload,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/providers/AuthProvider';
import {
  createTeamTrack,
  fetchLeetcodeProblems,
  exportTeamTrack,
  importProblems,
} from '@/lib/services/teamRaceTrack';

interface TeamTrackBuilderProps {
  teamId: string;
  onTrackCreated: () => void;
  onClose: () => void;
}

export default function TeamTrackBuilder({
  teamId,
  onTrackCreated,
  onClose,
}: TeamTrackBuilderProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'method' | 'build' | 'review'>('method');
  const [method, setMethod] = useState<'manual' | 'import' | 'scrape'>('manual');
  const [trackName, setTrackName] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [trackColor, setTrackColor] = useState('#06b6d4');
  const [weeks, setWeeks] = useState<any>({});
  const [problemInput, setProblemInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScrapeProblems = async () => {
    try {
      setError('');
      setLoading(true);

      // Parse problem numbers from input (comma or space separated)
      const numbers = problemInput
        .split(/[,\s]+/)
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) {
        setError('Please enter valid LeetCode problem numbers');
        return;
      }

      const problems = await fetchLeetcodeProblems(numbers);

      // Organize into weeks
      const newWeeks: any = {};
      const itemsPerWeek = 7;

      for (let i = 0; i < problems.length; i += itemsPerWeek) {
        const weekNum = Math.floor(i / itemsPerWeek) + 1;
        newWeeks[`Week ${weekNum}`] = {
          title: `Week ${weekNum}`,
          days: [
            {
              topic: `Problems ${i + 1}-${Math.min(i + itemsPerWeek, problems.length)}`,
              problems: problems.slice(i, i + itemsPerWeek),
            },
          ],
        };
      }

      setWeeks(newWeeks);
      setStep('review');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        const importedWeeks = importProblems(jsonData);
        setWeeks(importedWeeks);
        setTrackName(jsonData.trackName || '');
        setTrackTitle(jsonData.trackTitle || '');
        setTrackColor(jsonData.trackColor || '#06b6d4');
        setStep('review');
      } catch (err) {
        setError('Failed to import JSON. Please ensure it is valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateTrack = async () => {
    if (!user?.id || !trackName.trim() || !trackTitle.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createTeamTrack(
        teamId,
        trackName.trim(),
        trackTitle.trim(),
        trackColor,
        weeks,
        user.id
      );
      onTrackCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create track');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black border border-cyan-500/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 p-6 border-b border-gray-800 flex items-center justify-between bg-black/95 backdrop-blur">
          <h2 className="text-2xl font-bold text-white">Create Team Track</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-gray-300 mb-6">Choose how to create your track:</p>

              <button
                onClick={() => {
                  setMethod('scrape');
                  setStep('build');
                }}
                className="w-full p-6 border-2 border-cyan-500/30 hover:border-cyan-500/60 rounded-lg text-left transition-all hover:bg-cyan-500/5"
              >
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Scrape from LeetCode
                </h3>
                <p className="text-sm text-gray-400">
                  Enter LeetCode problem numbers and we'll fetch them automatically
                </p>
              </button>

              <button
                onClick={() => {
                  setMethod('import');
                  setStep('build');
                }}
                className="w-full p-6 border-2 border-blue-500/30 hover:border-blue-500/60 rounded-lg text-left transition-all hover:bg-blue-500/5"
              >
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import JSON
                </h3>
                <p className="text-sm text-gray-400">
                  Import a previously exported track or custom JSON file
                </p>
              </button>

              <button
                onClick={() => {
                  setMethod('manual');
                  setStep('build');
                }}
                className="w-full p-6 border-2 border-purple-500/30 hover:border-purple-500/60 rounded-lg text-left transition-all hover:bg-purple-500/5"
              >
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Manual Setup
                </h3>
                <p className="text-sm text-gray-400">
                  Create a track by manually adding problems
                </p>
              </button>
            </div>
          )}

          {step === 'build' && (
            <div className="space-y-6">
              {/* Track Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Track Name (ID)
                  </label>
                  <input
                    type="text"
                    value={trackName}
                    onChange={(e) =>
                      setTrackName(e.target.value.replace(/\s+/g, '_'))
                    }
                    placeholder="e.g., beginner_path"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={method === 'import'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Track Title
                  </label>
                  <input
                    type="text"
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    placeholder="e.g., Beginner Learning Path"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={method === 'import'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Track Color
                  </label>
                  <input
                    type="color"
                    value={trackColor}
                    onChange={(e) => setTrackColor(e.target.value)}
                    className="w-full h-10 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Method-specific inputs */}
              {method === 'scrape' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      LeetCode Problem Numbers
                    </label>
                    <textarea
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      placeholder="Enter problem numbers separated by commas or spaces&#10;e.g.: 1, 2, 3, 100, 101"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                      rows={4}
                    />
                  </div>

                  <button
                    onClick={handleScrapeProblems}
                    disabled={loading || !problemInput.trim()}
                    className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-lg text-white font-medium transition-colors"
                  >
                    {loading ? 'Fetching Problems...' : 'Fetch Problems'}
                  </button>
                </div>
              )}

              {method === 'import' && (
                <div className="space-y-4">
                  <label className="block">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                    <div className="w-full p-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-white font-medium">
                        Click to upload JSON file
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        or drag and drop
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-4">Track Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Name:</span>{' '}
                    <span className="text-white">{trackName}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Title:</span>{' '}
                    <span className="text-white">{trackTitle}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Weeks:</span>{' '}
                    <span className="text-white">{Object.keys(weeks).length}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Total Problems:</span>{' '}
                    <span className="text-white">
                      {Object.values(weeks).reduce(
                        (total: number, week: any) =>
                          total +
                          (week.days || []).reduce(
                            (dayTotal: number, day: any) =>
                              dayTotal + (day.problems || []).length,
                            0
                          ),
                        0
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                <h3 className="font-semibold text-white mb-4">Weeks Preview</h3>
                <div className="space-y-3">
                  {Object.entries(weeks).map(([weekKey, week]: [string, any]) => (
                    <div key={weekKey} className="text-sm">
                      <p className="text-cyan-400 font-medium">{weekKey}</p>
                      <p className="text-gray-400 ml-4">
                        {(week.days || []).reduce(
                          (total: number, day: any) =>
                            total + (day.problems || []).length,
                          0
                        )}{' '}
                        problems
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="mt-8 flex gap-3 border-t border-gray-800 pt-6">
            {step !== 'method' && (
              <button
                onClick={() =>
                  step === 'review'
                    ? setStep('build')
                    : setStep('method')
                }
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                Back
              </button>
            )}

            {step === 'build' && method !== 'import' && (
              <button
                onClick={() => setStep('review')}
                disabled={!trackName.trim() || !trackTitle.trim()}
                className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-lg text-white font-medium transition-colors"
              >
                Next
              </button>
            )}

            {step === 'build' && method === 'import' && Object.keys(weeks).length > 0 && (
              <button
                onClick={() => setStep('review')}
                className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-medium transition-colors"
              >
                Next
              </button>
            )}

            {step === 'review' && (
              <button
                onClick={handleCreateTrack}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 rounded-lg text-white font-medium transition-colors"
              >
                {loading ? 'Creating...' : 'Create Track'}
              </button>
            )}

            {step === 'method' && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}