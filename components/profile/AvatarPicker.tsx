// components/profile/AvatarPicker.tsx
"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { avatarIcons } from '@/lib/utils/avatars';

interface AvatarPickerProps {
  show: boolean;
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
  onClose: () => void;
}

export default function AvatarPicker({ show, selectedAvatar, onSelect, onClose }: AvatarPickerProps) {
  return (
    <AnimatePresence>
      {show && (
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
            className="relative bg-gray-900 rounded-2xl border border-cyan-500/50 p-6 max-w-md w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30"></div>
            
            <div className="relative">
              <h3 className="text-xl font-bold mb-4 text-white">Choose Your Avatar</h3>
              <div className="grid grid-cols-4 gap-3">
                {avatarIcons.map(avatar => {
                  const AvatarIcon = avatar.icon;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => onSelect(avatar.id)}
                      className={`aspect-square rounded-xl bg-gradient-to-br ${avatar.color} flex items-center justify-center hover:scale-110 transition-transform ${
                        selectedAvatar === avatar.id ? 'ring-4 ring-white' : ''
                      }`}
                    >
                      <AvatarIcon className="w-8 h-8 text-white" />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}