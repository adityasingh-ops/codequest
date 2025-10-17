"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Users,
  Mail,
  X,
  Settings,
  LogOut,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/lib/providers/AuthProvider';
import {
  createTeam,
  getTeamsByUserId,
  getTeamDetails,
  inviteUserToTeam,
  leaveTeam,
  removeTeamMember,
} from '@/lib/services/teamService';

interface Team {
  id: string;
  team_name: string;
  description: string;
  avatar: string;
  creator_id: string;
  created_at: string;
}

interface TeamMember {
  user_id: string;
  role: string;
  user_stats?: {
    name: string;
    avatar: string;
    points: number;
  };
}

export default function TeamManagement() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user's teams
  useEffect(() => {
    if (!user?.id) return;

    const loadTeams = async () => {
      try {
        const userTeams = await getTeamsByUserId(user.id);
        setTeams(userTeams);
        if (userTeams.length > 0) {
          const details = await getTeamDetails(userTeams[0].id);
          setSelectedTeam(details);
        }
      } catch (err) {
        console.error('Error loading teams:', err);
        setError('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, [user?.id]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !teamName.trim()) return;

    setLoading(true);
    try {
      const newTeam = await createTeam(
        teamName.trim(),
        user.id,
        teamDescription.trim()
      );
      setTeams((prev) => [...prev, newTeam]);
      setSelectedTeam(newTeam);
      setTeamName('');
      setTeamDescription('');
      setShowCreateModal(false);
      setSuccess('Team created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedTeam || !inviteEmail.trim()) return;

    setLoading(true);
    try {
      await inviteUserToTeam(
        selectedTeam.id,
        inviteEmail.trim(),
        user.id
      );
      setInviteEmail('');
      setShowInviteModal(false);
      setSuccess('Invitation sent successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Reload team details
      const details = await getTeamDetails(selectedTeam.id);
      setSelectedTeam(details);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!user?.id || !selectedTeam) return;

    const confirmed = window.confirm('Are you sure you want to leave this team?');
    if (!confirmed) return;

    try {
      await leaveTeam(selectedTeam.id, user.id);
      setTeams((prev) =>
        prev.filter((team) => team.id !== selectedTeam.id)
      );
      setSelectedTeam(null);
      setSuccess('Left team successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to leave team');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!user?.id || !selectedTeam) return;

    const confirmed = window.confirm('Remove this member from the team?');
    if (!confirmed) return;

    try {
      await removeTeamMember(selectedTeam.id, memberId, user.id);
      const details = await getTeamDetails(selectedTeam.id);
      setSelectedTeam(details);
      setSuccess('Member removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
    }
  };

  const isTeamCreator = user?.id === selectedTeam?.creator_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400"
        >
          {success}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Your Teams</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-800 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">Loading...</div>
            ) : teams.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No teams yet. Create one!</p>
              </div>
            ) : (
              teams.map((team) => (
                <button
                  key={team.id}
                  onClick={async () => {
                    const details = await getTeamDetails(team.id);
                    setSelectedTeam(details);
                  }}
                  className={`w-full p-4 text-left transition-colors ${
                    selectedTeam?.id === team.id
                      ? 'bg-cyan-500/10 border-l-2 border-cyan-500'
                      : 'hover:bg-gray-900/50'
                  }`}
                >
                  <p className="font-semibold text-white">{team.team_name}</p>
                  <p className="text-sm text-gray-400 mt-1">{team.description}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Team Details */}
        {selectedTeam ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Team Info */}
            <div className="bg-black rounded-lg border border-cyan-500/30 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedTeam.team_name}
                  </h2>
                  <p className="text-gray-400 mt-2">
                    {selectedTeam.description}
                  </p>
                </div>
                {!isTeamCreator && (
                  <button
                    onClick={handleLeaveTeam}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-colors"
                    title="Leave team"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isTeamCreator && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-medium transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Invite Member
                </button>
              )}
            </div>

            {/* Team Members */}
            <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members ({selectedTeam.team_members?.length || 0})
                </h3>
              </div>

              <div className="divide-y divide-gray-800">
                {(selectedTeam.team_members || []).map((member: TeamMember) => (
                  <div
                    key={member.user_id}
                    className="p-4 flex items-center justify-between hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {member.user_stats?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400">
                          {member.role}
                        </span>
                        <span className="text-sm text-gray-400">
                          {member.user_stats?.points} pts
                        </span>
                      </div>
                    </div>

                    {isTeamCreator && member.role !== 'creator' && (
                      <button
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-black rounded-lg border border-cyan-500/30 p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">Select a team to view details</p>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black border border-cyan-500/30 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Team</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Enter team description (optional)"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  rows={3}
                />
              </div>

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
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-lg text-white font-medium transition-colors"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black border border-cyan-500/30 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Invite Member</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded-lg text-white font-medium transition-colors"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}