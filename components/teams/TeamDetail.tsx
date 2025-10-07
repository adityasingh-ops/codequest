// components/teams/TeamDetail.tsx
'use client';

import { useState } from 'react';
import { useTeamDetail } from '@/lib/hooks/useTeams';
import { 
  Users, Trophy, Crown, Shield, Settings, 
  UserPlus, LogOut, Copy, Check, Activity,
  TrendingUp, Calendar, Award, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAvatarComponent } from '@/lib/config/avatar';

interface TeamDetailProps {
  teamId: string;
  currentUserId: string;
}

export default function TeamDetail({ teamId, currentUserId }: TeamDetailProps) {
  const { team, members, loading, refetch } = useTeamDetail(teamId);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'activity' | 'stats'>('members');

  const copyInviteCode = () => {
    if (team?.invite_code) {
      navigator.clipboard.writeText(team.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isOwner = team?.owner_id === currentUserId;
  const isMember = members.some(m => m.user_id === currentUserId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-20">
        <Users className="w-20 h-20 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Team not found</h3>
        <p className="text-gray-400">This team may have been deleted or made private.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
              <p className="text-gray-400">{team.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  {team.member_count}/{team.max_members} members
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  {team.total_points} points
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isOwner && (
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            )}
            {isMember && !isOwner && (
              <button className="px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Leave Team
              </button>
            )}
          </div>
        </div>

        {/* Invite Code */}
        {team.invite_code && isMember && (
          <div className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Invite Code</p>
              <p className="font-mono text-xl font-bold tracking-widest">{team.invite_code}</p>
            </div>
            <button
              onClick={copyInviteCode}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl p-4 border border-yellow-500/30">
          <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold">{team.total_points}</p>
          <p className="text-sm text-gray-400">Total Points</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl p-4 border border-blue-500/30">
          <Users className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">{team.member_count}</p>
          <p className="text-sm text-gray-400">Members</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/30">
          <Activity className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">{Math.round(team.total_points / team.member_count)}</p>
          <p className="text-sm text-gray-400">Avg Points</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
          <Star className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-bold">#{Math.floor(Math.random() * 100) + 1}</p>
          <p className="text-sm text-gray-400">Team Rank</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="border-b border-gray-700 px-4">
          <div className="flex gap-1">
            {[
              { id: 'members', label: 'Members', icon: Users },
              { id: 'activity', label: 'Activity', icon: Activity },
              { id: 'stats', label: 'Statistics', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'members' && (
            <div className="space-y-3">
              {members.map((member, index) => {
                const isTeamOwner = member.user_id === team.owner_id;
                const { IconComponent, color } = getAvatarComponent(member.user_stats?.avatar || 'user');

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg ${
                      isTeamOwner
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                        : 'bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{member.user_stats?.name || 'Anonymous'}</p>
                          {isTeamOwner && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              <Crown className="w-3 h-3" />
                              Owner
                            </span>
                          )}
                          {member.role === 'admin' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              <Shield className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            {member.points_contributed} points
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Activity feed coming soon</p>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Detailed statistics coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}