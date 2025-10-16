"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Search, Users } from 'lucide-react';
export default function UserTab({ users }: { users: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(player => 
    (player.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (player.leetcode_username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
    <div className="bg-black rounded-lg border border-cyan-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
                <Users className="w-7 h-7 text-white" />
                Members
              </h2>
              <p className="text-sm text-gray-400 mt-1">Top coders in your community</p>
            </div>
             {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or LeetCode username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
          
          </div>
        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
            {filteredUsers.map((user, index) => (
                <div key={user.user_id} className="p-4 flex items-center gap-4 hover:bg-gray-900/50 transition-colors cursor-pointer">
                    <div className="w-12 flex justify-center">
                        {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-bold">{user.name}</p>
                        </div>
                        <p className="text-sm text-gray-400">{user.leetcode_username}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">{user.points}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
            ))}
        </div>
        </div>
        </div>
      </motion.div>
    );
}