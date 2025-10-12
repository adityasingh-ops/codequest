// components/problems/ProblemsTab.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { problemData,type Problem, type TrackData } from '@/lib/utils/problemData';
import ProblemCard from './ProblemCard';
import CustomTrackModal from './CustomTrackModel';
import { getCustomTracks } from '@/lib/services/customTrack';

interface ProblemsTabProps {
  solvedProblems: Set<number>;
  onProblemToggle: (problemId: number, points: number, verified: boolean) => Promise<void>;
  leetcodeUsername?: string;
  revisionProblems: Set<number>;
  toggleRevisionStatus: (problemId: number) => Promise<void>;
  userId?: string;
}

export default function ProblemsTab({ 
  solvedProblems, 
  onProblemToggle,
  leetcodeUsername,
  revisionProblems,
  toggleRevisionStatus,
  userId
}: ProblemsTabProps) {
  const [selectedTrack, setSelectedTrack] = useState('Beginner');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set(['']));
  const [showCustomTrackModal, setShowCustomTrackModal] = useState(false);
  const [allTracks, setAllTracks] = useState<ProblemData>(problemData);
  const [loading, setLoading] = useState(false);

  // Load custom tracks on mount
  useEffect(() => {
    if (userId) {
      loadCustomTracks();
    }
  }, [userId]);
  const handleExportTrack = (trackName: string, trackData: TrackData) => {
  const exportData = {
    trackName,
    trackTitle: trackData.title,
    trackColor: trackData.color,
    weeks: trackData.weeks
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${trackName}_leetcode_track.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleDeleteTrack = async (trackName: string) => {
  if (!userId) return;
  
  const confirmed = window.confirm('Are you sure you want to delete this custom track? This action cannot be undone.');
  if (!confirmed) return;

  setLoading(true);
  try {
    const customTracks = await getCustomTracks(userId);
    const trackToDelete = customTracks.find(t => t.track_name === trackName);
    
    if (trackToDelete) {
      const { deleteCustomTrack } = await import('@/lib/services/customTrack');
      await deleteCustomTrack(trackToDelete.id, userId);
      
      // Reload tracks
      await loadCustomTracks();
      
      // If deleted track was selected, switch to Beginner
      if (selectedTrack === trackName) {
        setSelectedTrack('Beginner');
      }
    }
  } catch (error) {
    console.error('Error deleting track:', error);
    alert('Failed to delete track. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const loadCustomTracks = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const customTracks = await getCustomTracks(userId);
      
      // Merge custom tracks with default tracks
      const merged: ProblemData = { ...problemData };
      customTracks.forEach(track => {
        merged[track.track_name] = {
          title: track.track_title,
          color: track.track_color,
          weeks: track.weeks,
          isCustom: true
        };
      });
      
      setAllTracks(merged);
    } catch (error) {
      console.error('Error loading custom tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekKey)) {
        newSet.delete(weekKey);
      } else {
        newSet.add(weekKey);
      }
      return newSet;
    });
  };

  const handleTrackCreated = () => {
    loadCustomTracks();
    setShowCustomTrackModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* Track Selection */}
        {/* <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Select Track</h2>
            {userId && (
              <button
                onClick={() => setShowCustomTrackModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-medium transition-all"
              >
                <Plus className="w-4 h-4 text-white" />
                Create Custom Track
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(allTracks).map(([track, data]) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  selectedTrack === track
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'
                }`}
              >
                {selectedTrack === track && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30"></div>
                )}
                <div className="relative">
  <div className="flex items-center justify-between mb-1">
    <h3 className="text-xl font-bold text-white">{data.title}</h3>
    {data.isCustom && (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleExportTrack(track, data);
          }}
          className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded text-xs text-blue-400 transition-colors"
          title="Export to JSON"
        >
          Export
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTrack(track);
          }}
          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-xs text-red-400 transition-colors"
          title="Delete track"
        >
          Delete
        </button>
        <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-400">
          Custom
        </span>
      </div>
    )}
  </div>
  <p className="text-sm text-gray-400">
    {Object.keys(data.weeks).length} weeks
  </p>
</div>
              </button>
            ))}
          </div>
        </div> */}

        {/* Problems List */}
        <div className="space-y-4">
          {Object.entries(allTracks[selectedTrack]?.weeks || {}).map(([weekKey, week]) => (
            <div key={weekKey} className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 hover:from-cyan-500/20 hover:to-blue-500/20 rounded-xl blur transition duration-300"></div>
              
              <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleWeek(weekKey)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedWeeks.has(weekKey) ? 
                      <ChevronDown className="w-5 h-5 text-cyan-400" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                    <span className="font-bold text-white">{weekKey}: {week.title}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {week.days.reduce((acc, day) => acc + day.problems.length, 0)} problems
                  </span>
                </button>

                <AnimatePresence>
                  {expandedWeeks.has(weekKey) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {week.days.map((day, dayIdx) => (
                        <div key={dayIdx} className="border-t border-gray-800">
                          <div className="px-4 py-3 bg-gray-800/30">
                            <p className="text-sm font-medium text-gray-300">{day.topic}</p>
                          </div>
                          <div className="divide-y divide-gray-800">
                            {day.problems.map(problem => (
                              <ProblemCard
                                key={problem.id}
                                problem={problem}
                                isSolved={solvedProblems.has(problem.id)}
                                isMarkedForRevision={revisionProblems.has(problem.id)}
                                onToggleRevision={toggleRevisionStatus}
                                onToggle={onProblemToggle}
                                leetcodeUsername={leetcodeUsername}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Custom Track Modal */}
      {showCustomTrackModal && (
        <CustomTrackModal
          userId={userId!}
          onClose={() => setShowCustomTrackModal(false)}
          onSuccess={handleTrackCreated}
        />
      )}
    </>
  );
}