// components/teams/CreateTeamModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Lock, Unlock, Rocket } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: any) => Promise<void>;
}

export default function CreateTeamModal({ isOpen, onClose, onCreateTeam }: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    max_members: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreateTeam(formData);
      setFormData({ name: '', description: '', is_private: false, max_members: 10 });
      onClose();
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border border-orange-500/30 rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Rocket className="w-7 h-7 text-orange-400" />
                <h2 className="text-2xl font-semibold text-white">Create New Team</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                  placeholder="Enter your team name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={3}
                  placeholder="Describe your team goals..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Members</label>
                <input
                  type="number"
                  value={formData.max_members}
                  onChange={(e) =>
                    setFormData({ ...formData, max_members: parseInt(e.target.value) })
                  }
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min={2}
                  max={50}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_private}
                  onChange={(e) =>
                    setFormData({ ...formData, is_private: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-600 bg-gray-800 accent-orange-500"
                />
                <div className="flex items-center gap-2">
                  {formData.is_private ? (
                    <Lock className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Unlock className="w-5 h-5 text-green-400" />
                  )}
                  <span className="text-sm text-gray-300">
                    {formData.is_private
                      ? 'Private Team (invite only)'
                      : 'Public Team (anyone can join)'}
                  </span>
                </div>
              </label>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Team'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
