"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowRight, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/lib/providers/AuthProvider';
import { joinTeamByCode, getTeamByJoinCode } from '@/lib/services/teamSheet';
import { sendMemberJoined } from '@/lib/services/notificationService';

interface JoinTeamByCodeProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function JoinTeamByCode({ onSuccess, onClose }: JoinTeamByCodeProps) {
  const { user } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewTeam, setPreviewTeam] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePreview = async () => {
    if (!joinCode.trim()) return;

    setLoading(true);
    setError('');
    setPreviewTeam(null);

    try {
      const team = await getTeamByJoinCode(joinCode.trim().toUpperCase());
      if (!team) {
        throw new Error('Invalid join code');
      }
      setPreviewTeam(team);
    } catch (err: any) {
      setError(err.message || 'Invalid join code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user?.id || !joinCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const teamId = await joinTeamByCode(joinCode.trim().toUpperCase(), user.id);
      
      // Send notification to team members
      await sendMemberJoined(teamId, user.id, user.user_metadata?.full_name || 'New member');
      
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to join team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !previewTeam && joinCode.length >= 6) {
      handlePreview();
    }
  };

  const handleReset = () => {
    setPreviewTeam(null);
    setJoinCode('');
    setError('');
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Welcome to the team! 🎉</h3>
        <p className="text-gray-400 mb-4">You've successfully joined the team</p>
        <motion.div
          className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black rounded-lg border border-cyan-500/30 p-6"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Join a Team</h2>
          <p className="text-gray-400">Enter the team code to join instantly</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                setJoinCode(value);
                setPreviewTeam(null);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="XXXXXXXX"
              maxLength={8}
              disabled={loading || !!previewTeam}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl font-bold tracking-widest placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {joinCode.length}/8 characters
            </p>
          </div>

          {!previewTeam ? (
            <button
              onClick={handlePreview}
              disabled={loading || joinCode.length < 6}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking code...
                </>
              ) : (
                <>
                  Preview Team
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <>
              {/* Team Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg">{previewTeam.team_name}</h3>
                    <p className="text-sm text-gray-400 truncate">{previewTeam.description || 'No description'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cyan-500/30">
                  <div className="text-center p-2 bg-black/30 rounded">
                    <p className="text-xs text-gray-400">Members</p>
                    <p className="text-lg font-bold text-white">{previewTeam.member_count || 0}</p>
                  </div>
                  <div className="text-center p-2 bg-black/30 rounded">
                    <p className="text-xs text-gray-400">Total Points</p>
                    <p className="text-lg font-bold text-cyan-400">{previewTeam.total_points || 0}</p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleJoin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 rounded-lg text-white font-medium transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining team...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Join This Team
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-white text-sm transition-colors"
                >
                  Try Different Code
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400">💡</span>
            </div>
            <div>
              <p className="mb-1">Team codes are 8 characters long and case-insensitive</p>
              <p>Ask your team admin for the join code</p>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </motion.div>
    </div>
  );
}