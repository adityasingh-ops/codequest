// components/battles/BattleLobby.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Play, X, Copy, Check } from 'lucide-react';
import { Battle, BattleParticipant } from '@/lib/types/battles.types';

interface BattleLobbyProps {
  battle: Battle;
  participants: BattleParticipant[];
  isCreator: boolean;
  onStart: () => void;
  onLeave: () => void;
}

export default function BattleLobby({ battle, participants, isCreator, onStart, onLeave }: BattleLobbyProps) {
  const [copied, setCopied] = useState(false);

  const copyBattleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStart = participants.length >= 2 && participants.length <= battle.max_participants;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-2xl border border-red-500/30 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{battle.title}</h1>
            <p className="text-gray-400">{battle.description}</p>
          </div>
          <button
            onClick={copyBattleLink}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400 mb-1">Type</p>
            <p className="font-bold">{battle.battle_type.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400 mb-1">Duration</p>
            <p className="font-bold">{battle.duration_minutes} minutes</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400 mb-1">Problems</p>
            <p className="font-bold">{battle.problem_ids.length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400 mb-1">Players</p>
            <p className="font-bold">{participants.length}/{battle.max_participants}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Participants ({participants.length}/{battle.max_participants})
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {participants.map((participant, index) => {
            const isCreatorUser = participant.user_id === battle.created_by;
            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  isCreatorUser ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' : 'bg-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{participant.user_stats?.name || 'Anonymous'}</p>
                      {isCreatorUser && <Crown className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <p className="text-sm text-gray-400">Ready to battle</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {[...Array(battle.max_participants - participants.length)].map((_, i) => (
            <div key={`empty-${i}`} className="p-4 rounded-lg bg-gray-700/20 border-2 border-dashed border-gray-600">
              <div className="flex items-center justify-center h-12">
                <p className="text-gray-500 text-sm">Waiting for player...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {isCreator ? (
          <button
            onClick={onStart}
            disabled={!canStart}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Battle
          </button>
        ) : (
          <div className="flex-1 bg-blue-500/20 border border-blue-500/30 py-4 rounded-xl text-center">
            <p className="font-bold text-blue-400">Waiting for host to start...</p>
          </div>
        )}
        <button
          onClick={onLeave}
          className="px-6 bg-red-500 hover:bg-red-600 py-4 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          Leave
        </button>
      </div>
    </div>
  );
}