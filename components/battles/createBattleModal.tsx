// components/battles/CreateBattleModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords, Users, Clock, Trophy, Plus, Minus } from 'lucide-react';

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBattle: (battleData: any) => Promise<void>;
}

export default function CreateBattleModal({ isOpen, onClose, onCreateBattle }: CreateBattleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    battle_type: '1v1' as '1v1' | 'team' | 'free_for_all',
    max_participants: 2,
    duration_minutes: 30,
    problem_ids: [1, 2, 3] // Default problems
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problemInput, setProblemInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.problem_ids.length === 0) {
      alert('Please add at least one problem');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateBattle(formData);
      setFormData({
        title: '',
        description: '',
        battle_type: '1v1',
        max_participants: 2,
        duration_minutes: 30,
        problem_ids: [1, 2, 3]
      });
      onClose();
    } catch (error) {
      console.error('Error creating battle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProblem = () => {
    const problemId = parseInt(problemInput);
    if (problemId && !formData.problem_ids.includes(problemId)) {
      setFormData({
        ...formData,
        problem_ids: [...formData.problem_ids, problemId]
      });
      setProblemInput('');
    }
  };

  const removeProblem = (id: number) => {
    setFormData({
      ...formData,
      problem_ids: formData.problem_ids.filter(p => p !== id)
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Create Battle</h2>
                  <p className="text-sm text-gray-400">Challenge others to a coding duel</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Battle Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Battle Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Epic Coding Battle"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                  placeholder="Show off your coding skills..."
                />
              </div>

              {/* Battle Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Battle Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '1v1', label: '1v1 Duel', icon: Users, desc: 'One on one' },
                    { value: 'team', label: 'Team Battle', icon: Users, desc: 'Team vs Team' },
                    { value: 'free_for_all', label: 'Free for All', icon: Trophy, desc: 'Everyone competes' }
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, battle_type: type.value as any })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.battle_type === type.value
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{type.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium mb-2">Max Participants</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, max_participants: Math.max(2, formData.max_participants - 1) })}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 2 })}
                      className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                      min={2}
                      max={20}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, max_participants: Math.min(20, formData.max_participants + 1) })}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <select
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                      className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Problems */}
              <div>
                <label className="block text-sm font-medium mb-2">LeetCode Problems</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    value={problemInput}
                    onChange={(e) => setProblemInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProblem())}
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter problem number (e.g., 1, 2, 3)"
                  />
                  <button
                    type="button"
                    onClick={addProblem}
                    className="px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {formData.problem_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.problem_ids.map((id) => (
                      <div
                        key={id}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg"
                      >
                        <span className="font-mono">#{id}</span>
                        <button
                          type="button"
                          onClick={() => removeProblem(id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Creating Battle...' : 'Create Battle'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}