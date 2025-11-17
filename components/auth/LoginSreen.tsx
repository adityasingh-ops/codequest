// components/auth/LoginScreen.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Trophy } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full"
      >
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-75 animate-pulse"></div>
        
        <div className="relative bg-black border border-cyan-500/50 rounded-3xl p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black border border-cyan-500/60 flex items-center justify-center transform hover:scale-110 transition-transform">
                <img
                  src="/logo.png"
                  alt="CodeQuest logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-3 text-center">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              CodeQuest
            </span>
          </h1>
          
          <p className="text-gray-400 text-center mb-8 text-lg">
            Your Ultimate Coding Journey Tracker
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {[
              { icon: Trophy, text: "Track your progress", color: "from-yellow-400 to-orange-500" },
              { icon: Zap, text: "Compete with friends", color: "from-cyan-400 to-blue-500" },
              { icon: Sparkles, text: "Unlock achievements", color: "from-purple-400 to-pink-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="flex items-center gap-3 text-gray-300"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGoogle}
            className="relative w-full group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </div>
          </motion.button>

          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}