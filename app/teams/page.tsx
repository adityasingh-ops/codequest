"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Users,
  Trophy,
  FileText,
  Settings,
  ArrowLeft,
  Crown,
  Shield,
  Mail,
  Key,
  Search,
} from 'lucide-react';
import { useAuth } from '@/lib/providers/AuthProvider';
import { getAvatarComponent } from '@/lib/utils/avatars';
import {
  createTeam,
  getTeamsByUserId,
  getTeamDetails,
} from '@/lib/services/teamService';
import TeamSheetManagement from '@/components/teams/createTeam';
import JoinTeamByCode from '@/components/teams/joinTeam';

type ViewMode = 'list' | 'create' | 'join' | 'details';
type TeamTab = 'sheets' | 'members' | 'settings';

export default function TeamsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<TeamTab>('sheets');
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create team form
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadTeams();
    }
  }, [user?.id]);

  const loadTeams = async () => {
    if (!user?.id) return;
    try {
      const userTeams = await getTeamsByUserId(user.id);
      setTeams(userTeams);
    } catch (err) {
      console.error('Error loading teams:', err);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !teamName.trim()) return;

    setLoading(true);
    setError('');
    try {
      const newTeam = await createTeam(teamName.trim(), user.id, description.trim());
      setTeams((prev) => [...prev, newTeam]);
      setTeamName('');
      setDescription('');
      setSuccess('Team created successfully! 🎉');
      setTimeout(() => {
        setSuccess('');
        setViewMode('list');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = async (team: any) => {
    try {
      const details = await getTeamDetails(team.id);
      setSelectedTeam(details);
      setViewMode('details');
      setActiveTab('sheets');
    } catch (err) {
      console.error('Error loading team details:', err);
      setError('Failed to load team details');
    }
  };

  const handleJoinSuccess = () => {
    loadTeams();
    setViewMode('list');
    setSuccess('Successfully joined team! 🎉');
    setTimeout(() => setSuccess(''), 3000);
  };

  const isTeamAdmin = selectedTeam && (
    selectedTeam.creator_id === user?.id ||
    selectedTeam.team_members?.some(
      (m: any) => m.user_id === user?.id && m.role === 'admin'
    )
  );

  // Render different views
  const renderListView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
          <p className="text-gray-400">Compete with your friends and track progress together</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode('join')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
          >
            <Key className="w-5 h-5" />
            Join Team
          </button>
          <button
            onClick={() => setViewMode('create')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Team
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">Loading teams...</p>
        </div>
      ) : teams.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-black rounded-lg border border-cyan-500/30"
        >
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
          <p className="text-gray-400 mb-6">Create or join a team to start competing!</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setViewMode('create')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-medium transition-colors"
            >
              Create Your First Team
            </button>
            <button
              onClick={() => setViewMode('join')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
            >
              Join Existing Team
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <motion.button
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectTeam(team)}
              className="bg-black rounded-lg border border-cyan-500/30 p-6 hover:border-cyan-500 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                {team.creator_id === user?.id && (
                  <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-400 text-xs flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Owner
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {team.team_name}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {team.description || 'No description'}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    {team.member_count || 0}
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Trophy className="w-4 h-4" />
                    {team.total_points || 0}
                  </span>
                </div>
                <span className="text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreateView = () => (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setViewMode('list')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Teams
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black rounded-lg border border-cyan-500/30 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create New Team</h2>
          <p className="text-gray-400">Start your own coding team and compete with friends</p>
        </div>

        <form onSubmit={handleCreateTeam} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Code Warriors, Algorithm Masters"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell others what your team is about..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={4}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/200 characters</p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">What's included:</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Create custom problem sheets
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-cyan-400" />
                Real-time leaderboards
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Invite unlimited members
              </li>
              <li className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Shareable join codes
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !teamName.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  const renderJoinView = () => (
    <div>
      <button
        onClick={() => setViewMode('list')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Teams
      </button>

      <JoinTeamByCode onSuccess={handleJoinSuccess} />
    </div>
  );

  const renderDetailsView = () => {
    if (!selectedTeam) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedTeam(null);
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Teams
          </button>
        </div>

        {/* Team Info Card */}
        <div className="bg-black rounded-lg border border-cyan-500/30 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{selectedTeam.team_name}</h1>
                <p className="text-gray-400">{selectedTeam.description}</p>
              </div>
            </div>
            {selectedTeam.creator_id === user?.id && (
              <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Team Owner
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{selectedTeam.member_count || 0}</p>
              <p className="text-sm text-gray-400">Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{selectedTeam.total_points || 0}</p>
              <p className="text-sm text-gray-400">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {selectedTeam.team_members?.length || 0}
              </p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'sheets'
                ? 'text-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Sheets
            {activeTab === 'sheets' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'members'
                ? 'text-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Members
            {activeTab === 'members' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
              />
            )}
          </button>
          {isTeamAdmin && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'settings'
                  ? 'text-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Settings
              {activeTab === 'settings' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                />
              )}
            </button>
          )}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'sheets' && (
            <motion.div
              key="sheets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TeamSheetManagement teamId={selectedTeam.id} isAdmin={isTeamAdmin} />
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white">Team Members</h3>
              </div>
              <div className="divide-y divide-gray-800">
                {selectedTeam.team_members?.map((member: any, index: number) => {
                  const { IconComponent, color } = getAvatarComponent(
                    member.user_stats?.avatar || 'user'
                  );
                  return (
                    <motion.div
                      key={member.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 flex items-center gap-4 hover:bg-gray-900/50 transition-colors"
                    >
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white flex items-center gap-2">
                          {member.user_stats?.name}
                          {member.user_id === user?.id && (
                            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400">
                              You
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                              member.role === 'creator'
                                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                                : member.role === 'admin'
                                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                                : 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                            }`}
                          >
                            {member.role === 'creator' && <Crown className="w-3 h-3" />}
                            {member.role === 'admin' && <Shield className="w-3 h-3" />}
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-cyan-400">
                          {member.points_contributed || 0}
                        </p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && isTeamAdmin && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black rounded-lg border border-cyan-500/30 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Team Settings</h3>
              <p className="text-gray-400">Settings coming soon...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'create' && renderCreateView()}
        {viewMode === 'join' && renderJoinView()}
        {viewMode === 'details' && renderDetailsView()}
      </div>
    </div>
  );
}