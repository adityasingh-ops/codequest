// components/battles/BattlesList.tsx
'use client';

import { useState } from 'react';
import { useBattles } from '@/lib/hooks/useBattles';
import BattleCard from './BattleCard';
import CreateBattleModal from './createBattleModal';
import { Swords, Plus, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function BattlesList() {
  const router = useRouter();
  const { battles, loading, createBattle, joinBattle } = useBattles();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateBattle = async (battleData: any) => {
    try {
      const battle = await createBattle(battleData);
      router.push(`/battles/${battle.id}`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleJoinBattle = async (battleId: string) => {
    try {
      await joinBattle(battleId);
      router.push(`/battles/${battleId}`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredBattles = battles.filter(battle => {
    const matchesStatus = statusFilter === 'all' || battle.status === statusFilter;
    const matchesSearch = battle.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Swords className="w-8 h-8 text-red-500" />
            Coding Battles
          </h1>
          <p className="text-gray-400">Test your skills in real-time competitions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Battle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search battles..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'waiting', label: 'Waiting' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value as any)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status.value
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Battles Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : filteredBattles.length === 0 ? (
        <div className="text-center py-20">
          <Swords className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No battles found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search' : 'Be the first to create a battle!'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Create First Battle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBattles.map((battle, index) => (
            <motion.div
              key={battle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BattleCard
                battle={battle}
                participantCount={0}
                onJoin={() => handleJoinBattle(battle.id)}
                onView={() => router.push(`/battles/${battle.id}`)}
                canJoin={battle.status === 'waiting'}
              />
            </motion.div>
          ))}
        </div>
      )}

      <CreateBattleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBattle={handleCreateBattle}
      />
    </div>
  );
}