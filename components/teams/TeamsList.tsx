// components/teams/TeamsList.tsx
'use client';

import { useState } from 'react';
import { useTeams } from '@/lib/hooks/useTeams';
import TeamCard from './TeamCard';
import CreateTeamModal from './CreateTeamModal';
import { Users, Plus, Search, Filter, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamsList() {
  const { teams, loading, createTeam, joinTeam, fetchTeams } = useTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'points' | 'members' | 'recent'>('points');
  const [joinCode, setJoinCode] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleCreateTeam = async (teamData: any) => {
    try {
      await createTeam(teamData);
      setShowCreateModal(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleJoinTeam = async (teamId: string, requiresCode: boolean) => {
    if (requiresCode) {
      setSelectedTeamId(teamId);
      setShowJoinModal(true);
      return;
    }

    try {
      await joinTeam(teamId);
      alert('Successfully joined team!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleJoinWithCode = async () => {
    if (!selectedTeamId) return;
    
    try {
      await joinTeam(selectedTeamId, joinCode);
      alert('Successfully joined team!');
      setShowJoinModal(false);
      setJoinCode('');
      setSelectedTeamId(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredAndSortedTeams = teams
    .filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || 
        (filterType === 'public' && !team.is_private) ||
        (filterType === 'private' && team.is_private);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.total_points - a.total_points;
        case 'members':
          return b.member_count - a.member_count;
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-gray-400">Join forces and compete together</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Team
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Teams</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="points">Top Points</option>
              <option value="members">Most Members</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredAndSortedTeams.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No teams found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search filters' : 'Be the first to create a team!'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Create First Team
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TeamCard
                team={team}
                onClick={() => window.location.href = `/teams/${team.id}`}
                onJoin={() => handleJoinTeam(team.id, team.is_private)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTeam={handleCreateTeam}
      />

      {/* Join with Code Modal */}
      {showJoinModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowJoinModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Enter Invite Code</h3>
            <p className="text-gray-400 mb-4">This is a private team. Please enter the invite code to join.</p>
            
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="XXXXXXXX"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 mb-4 font-mono text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={8}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinCode('');
                  setSelectedTeamId(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinWithCode}
                disabled={joinCode.length !== 8}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-colors"
              >
                Join Team
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}