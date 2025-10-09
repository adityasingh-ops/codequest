// components/problems/ProblemCard.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, Loader2, Shield, AlertCircle, BookMarked } from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils/helper';
import { PlatformService, PLATFORMS } from '@/lib/services/platformService';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  leetcodeNum: number;
  points: number;
}

interface ProblemCardProps {
  problem: Problem;
  isSolved: boolean;
  isMarkedForRevision: boolean;
  onToggle: (problemId: number, points: number, verified: boolean) => Promise<void>;
  onToggleRevision: (problemId: number) => Promise<void>;
  leetcodeUsername?: string;
}

export default function ProblemCard({ 
  problem, 
  isSolved,
  isMarkedForRevision,
  onToggle,
  onToggleRevision,
  leetcodeUsername 
}: ProblemCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRevisionLoading, setIsRevisionLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'verifying' | 'verified' | 'failed'>('none');

  const handleToggle = async () => {
    setIsLoading(true);
    setVerificationStatus('verifying');

    try {
      // If user has LeetCode username and is marking as solved, verify first
      if (!isSolved && leetcodeUsername) {
        try {
          const verification = await PlatformService.verifyProblemSolved(
            PLATFORMS.LEETCODE,
            leetcodeUsername,
            problem.title
          );

          if (!verification.verified) {
            setVerificationStatus('failed');
            const shouldContinue = confirm(
              `⚠️ Verification Notice\n\n${verification.message}\n\nWould you like to mark it as solved anyway?`
            );
            
            if (!shouldContinue) {
              setIsLoading(false);
              setVerificationStatus('none');
              return;
            }
          } else {
            setVerificationStatus('verified');
          }
        } catch (verifyError) {
          console.error('Verification error:', verifyError);
          const shouldContinue = confirm(
            `⚠️ Unable to verify with LeetCode\n\nThis could be due to:\n- Network issues\n- LeetCode API rate limits\n- Recent submission not yet synced\n\nWould you like to mark it as solved anyway?`
          );
          
          if (!shouldContinue) {
            setIsLoading(false);
            setVerificationStatus('none');
            return;
          }
        }
      }

      await onToggle(problem.id, problem.points, verificationStatus === 'verified');
      setVerificationStatus('none');
    } catch (error) {
      console.error('Error toggling problem:', error);
      alert('Failed to update progress. Please try again.');
      setVerificationStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevisionToggle = async () => {
    setIsRevisionLoading(true);
    try {
      await onToggleRevision(problem.id);
    } catch (error) {
      console.error('Error toggling revision:', error);
      alert('Failed to update revision status. Please try again.');
    } finally {
      setIsRevisionLoading(false);
    }
  };

  const problemUrl = `https://leetcode.com/problems/${problem.titleSlug || problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}/`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <div className={`relative p-4 flex items-center justify-between bg-black border rounded-lg transition-all ${
        isMarkedForRevision 
          ? 'border-orange-500/50 bg-orange-500/5' 
          : 'border-gray-800 hover:border-cyan-500/50'
      }`}>
        <div className="flex items-center gap-4 flex-1">
          {/* Checkbox with loading state */}
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              isSolved
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-500'
                : 'border-gray-600 hover:border-cyan-500'
            } ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:scale-110'}`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : isSolved ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : null}
          </button>

          {/* Verification indicator */}
          {verificationStatus === 'verified' && (
            <span title="Verified on LeetCode">
              <Shield className="w-4 h-4 text-green-400" />
            </span>
          )}
          {verificationStatus === 'failed' && (
            <span title="Not verified">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            </span>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-mono text-sm">#{problem.leetcodeNum}</span>
              <span className={`font-medium ${isSolved ? 'text-gray-500 line-through' : 'text-white'}`}>
                {problem.title}
              </span>
              {isMarkedForRevision && (
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30 flex items-center gap-1">
                  <BookMarked className="w-3 h-3" />
                  Revision
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="text-cyan-400 font-medium text-sm">{problem.points} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Revision Button */}
          <button
            onClick={handleRevisionToggle}
            disabled={isRevisionLoading}
            className={`p-2 rounded-lg transition-all ${
              isMarkedForRevision
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
            } ${isRevisionLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
            title={isMarkedForRevision ? 'Remove from revision' : 'Mark for revision'}
          >
            {isRevisionLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <BookMarked className={`w-5 h-5 ${isMarkedForRevision ? 'text-white' : 'text-gray-400'}`} />
            )}
          </button>

          {/* LeetCode Link */}
          <a
            href={problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg transition-all"
          >
            <ExternalLink className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}