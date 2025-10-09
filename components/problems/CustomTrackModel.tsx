// components/problems/CustomTrackModal.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Github, Loader, Upload, Plus, Trash2 } from 'lucide-react';
import { parseGithubTrack } from '@/lib/utils/githubParser';
import { saveCustomTrack } from '@/lib/services/customTrack';

interface CustomTrackModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface WeekInput {
  weekKey: string;
  title: string;
  problems: number[];
   problemsText?: string;
}


export default function CustomTrackModal({ userId, onClose, onSuccess }: CustomTrackModalProps) {
  const [step, setStep] = useState<'method' | 'github' | 'manual'>('method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // GitHub method
  const [githubUrl, setGithubUrl] = useState('');
  
  // Manual method
  const [trackName, setTrackName] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [trackColor, setTrackColor] = useState('from-purple-500 to-pink-600');
const [weeks, setWeeks] = useState<WeekInput[]>([
  { weekKey: 'Week 1', title: '', problems: [], problemsText: '' }
]);

  const handleGithubImport = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const trackData = await parseGithubTrack(githubUrl);
      
      await saveCustomTrack({
        userId,
        trackName: trackData.trackName,
        trackTitle: trackData.trackTitle,
        trackColor: trackData.trackColor,
        githubUrl,
        weeks: trackData.weeks
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to import from GitHub');
    } finally {
      setLoading(false);
    }
  };
  const handleJsonFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setLoading(true);
  setError('');

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate JSON structure
    if (!data.trackName || !data.trackTitle || !data.weeks) {
      throw new Error('Invalid JSON format. Missing required fields.');
    }

    // Optional: Validate all problems exist
    const allProblems: number[] = [];
    Object.values(data.weeks).forEach((week: any) => {
      week.days.forEach((day: any) => {
        day.problems.forEach((problem: any) => {
          if (problem.leetcodeNum) {
            allProblems.push(problem.leetcodeNum);
          }
        });
      });
    });

    if (allProblems.length > 0) {
      const { LeetCodeService } = await import('@/lib/services/leetcodeService');
      const { invalidProblems } = await LeetCodeService.validateAndFetchProblems(allProblems);
      
      if (invalidProblems.length > 0) {
        const proceed = window.confirm(
          `Warning: ${invalidProblems.length} problems don't exist on LeetCode (${invalidProblems.slice(0, 5).join(', ')}${invalidProblems.length > 5 ? '...' : ''}). Continue anyway?`
        );
        if (!proceed) {
          setLoading(false);
          return;
        }
      }
    }

    await saveCustomTrack({
      userId,
      trackName: data.trackName,
      trackTitle: data.trackTitle,
      trackColor: data.trackColor || 'from-purple-500 to-pink-600',
      githubUrl: null,
      weeks: data.weeks
    });

    onSuccess();
  } catch (err: any) {
    setError(err.message || 'Failed to import JSON file');
  } finally {
    setLoading(false);
  }
};
const handleManualCreate = async () => {
  if (!trackName.trim() || !trackTitle.trim()) {
    setError('Track name and title are required');
    return;
  }

  if (weeks.length === 0 || weeks.some(w => !w.title || w.problems.length === 0)) {
    setError('Each week must have a title and at least one problem');
    return;
  }

  setLoading(true);
  setError('');

  try {
    // Import the LeetCodeService
    const { LeetCodeService } = await import('@/lib/services/leetcodeService');
    
    // Validate all problems
    const allProblems = weeks.flatMap(w => w.problems);
    const { validProblems, invalidProblems } = await LeetCodeService.validateAndFetchProblems(allProblems);

    if (invalidProblems.length > 0) {
      setError(`The following problems do not exist on LeetCode: ${invalidProblems.join(', ')}`);
      setLoading(false);
      return;
    }

    // Transform manual input to track format
    const weeksData: Record<string, any> = {};
    let problemIndex = 0;
    
    weeks.forEach(week => {
      const weekProblems = validProblems.slice(problemIndex, problemIndex + week.problems.length);
      problemIndex += week.problems.length;
      
      // Map the problems to ensure they include LeetCode titles and links
      const formattedProblems = weekProblems.map(problem => ({
        titleSlug: problem.titleSlug,
        title: problem.title, // This is the actual title from LeetCode
        difficulty: problem.difficulty,
        link: `https://leetcode.com/problems/${problem.titleSlug}/`, // Direct LeetCode link
        // Include any other properties from the LeetCode response
        ...(problem.topicTags && { topicTags: problem.topicTags }),
        ...(problem.isPaidOnly !== undefined && { isPaidOnly: problem.isPaidOnly })
      }));
      
      weeksData[week.weekKey] = {
        title: week.title,
        days: [
          {
            topic: week.title,
            problems: formattedProblems
          }
        ]
      };
    });

    await saveCustomTrack({
      userId,
      trackName,
      trackTitle,
      trackColor,
      githubUrl: null,
      weeks: weeksData
    });

    onSuccess();
  } catch (err: any) {
    setError(err.message || 'Failed to create custom track');
  } finally {
    setLoading(false);
  }
};
const addWeek = () => {
  setWeeks([...weeks, { 
    weekKey: `Week ${weeks.length + 1}`, 
    title: '', 
    problems: [],
    problemsText: ''
  }]);
};

  const removeWeek = (index: number) => {
    setWeeks(weeks.filter((_, i) => i !== index));
  };

  const updateWeek = (index: number, field: keyof WeekInput, value: any) => {
    const updated = [...weeks];
    updated[index] = { ...updated[index], [field]: value };
    setWeeks(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create Custom Track</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Method Selection */}
          {/* Method Selection */}
{step === 'method' && (
  <div className="space-y-4">
    <p className="text-gray-400 mb-6">Choose how you'd like to create your custom track:</p>
    
    <button
      onClick={() => setStep('github')}
      className="w-full p-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all flex items-center gap-4"
    >
      <Github className="w-8 h-8 text-cyan-400" />
      <div className="text-left">
        <h3 className="text-lg font-bold text-white">Import from GitHub</h3>
        <p className="text-sm text-gray-400">Import a track from a GitHub README or JSON file</p>
      </div>
    </button>

    <button
      onClick={() => setStep('json')}
      className="w-full p-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all flex items-center gap-4"
    >
      <Upload className="w-8 h-8 text-blue-400" />
      <div className="text-left">
        <h3 className="text-lg font-bold text-white">Import JSON File</h3>
        <p className="text-sm text-gray-400">Upload a JSON file exported from another user</p>
      </div>
    </button>

    <button
      onClick={() => setStep('manual')}
      className="w-full p-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all flex items-center gap-4"
    >
      <Upload className="w-8 h-8 text-purple-400" />
      <div className="text-left">
        <h3 className="text-lg font-bold text-white">Create Manually</h3>
        <p className="text-sm text-gray-400">Enter problem numbers and organize into weeks</p>
      </div>
    </button>
  </div>
)}
{/* JSON Import */}
{step === 'json' && (
  <div className="space-y-4">
    <button
      onClick={() => setStep('method')}
      className="text-cyan-400 hover:text-cyan-300 text-sm"
    >
      ← Back to method selection
    </button>

    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Upload JSON File
      </label>
      <input
        type="file"
        accept=".json"
        onChange={handleJsonFileUpload}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 file:cursor-pointer"
      />
      <p className="mt-2 text-xs text-gray-500">
        Upload a JSON file exported from another user's custom track
      </p>
    </div>

    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h4 className="font-medium text-white mb-2">Expected JSON Format:</h4>
      <pre className="text-xs text-gray-400 overflow-x-auto">
{`{
  "trackName": "my_custom_track",
  "trackTitle": "🎯 My Custom Track",
  "trackColor": "from-purple-500 to-pink-600",
  "weeks": {
    "Week 1": {
      "title": "Arrays",
      "days": [...]
    }
  }
}`}
      </pre>
    </div>

    {loading && (
      <div className="flex items-center justify-center gap-2 text-cyan-400">
        <Loader className="w-5 h-5 animate-spin" />
        <span>Importing JSON...</span>
      </div>
    )}
  </div>
)}

          {/* GitHub Import */}
          {step === 'github' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('method')}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                ← Back to method selection
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo/blob/main/README.md"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Supports README.md or JSON files with problem lists
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Expected Format:</h4>
                <pre className="text-xs text-gray-400 overflow-x-auto">
{`# Track Title

## Week 1: Arrays
- Problem 1
- Problem 121
- Problem 217

## Week 2: Linked Lists  
- Problem 206
- Problem 21`}
                </pre>
              </div>

              <button
                onClick={handleGithubImport}
                disabled={loading || !githubUrl.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    Import Track
                  </>
                )}
              </button>
            </div>
          )}

          {/* Manual Creation */}
          {step === 'manual' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('method')}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                ← Back to method selection
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Track Name (Internal ID)
                </label>
                <input
                  type="text"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value.replace(/\s+/g, '_'))}
                  placeholder="my_custom_track"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Track Title (Display Name)
                </label>
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="🎯 My Custom Track"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Track Color
                </label>
                <select
                  value={trackColor}
                  onChange={(e) => setTrackColor(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="from-purple-500 to-pink-600">Purple to Pink</option>
                  <option value="from-green-500 to-emerald-600">Green to Emerald</option>
                  <option value="from-blue-500 to-indigo-600">Blue to Indigo</option>
                  <option value="from-orange-500 to-red-600">Orange to Red</option>
                  <option value="from-cyan-500 to-blue-600">Cyan to Blue</option>
                </select>
              </div>

              {/* Weeks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Weeks & Problems
                  </label>
                  <button
                    onClick={addWeek}
                    className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Week
                  </button>
                </div>

                <div className="space-y-4">
                  {weeks.map((week, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{week.weekKey}</h4>
                        {weeks.length > 1 && (
                          <button
                            onClick={() => removeWeek(index)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={week.title}
                        onChange={(e) => updateWeek(index, 'title', e.target.value)}
                        placeholder="Week title (e.g., Arrays & Strings)"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 mb-2"
                      />

                      <textarea
  value={week.problemsText || ''}
  onChange={(e) => {
    const text = e.target.value;
    const nums = text.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const updated = [...weeks];
    updated[index] = { 
      ...updated[index], 
      problemsText: text,
      problems: nums 
    };
    setWeeks(updated);
  }}
                        placeholder="LeetCode problem numbers (e.g., 1, 121, 217)"
                        rows={2}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {week.problems.length} problems
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleManualCreate}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Track'
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}