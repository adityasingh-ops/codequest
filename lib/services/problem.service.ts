// lib/services/problem.service.ts
import { useState, useCallback } from "react";
import { supabase } from "../supabase/client";
import toast from 'react-hot-toast';

export function useProblemService(userId?: string) {
    const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const [revisionProblems, setRevisionProblems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Initialize problem sets from user stats
     */
    const initializeProblems = useCallback((
        solved: number[] = [],
        revision: number[] = []
    ) => {
        setSolvedProblems(new Set(solved));
        setRevisionProblems(new Set(revision));
    }, []);

    /**
     * Update problem solved status
     */
    const updateProblemStatus = useCallback(async (
        problemId: number,
        points: number,
        currentPoints: number,
        currentSolvedCount: number
    ) => {
        if (!userId) {
            setError('User ID is required');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const isAlreadySolved = solvedProblems.has(problemId);
            const newSolvedProblems = new Set(solvedProblems);

            if (isAlreadySolved) {
                newSolvedProblems.delete(problemId);
            } else {
                newSolvedProblems.add(problemId);
            }

            const pointsChange = isAlreadySolved ? -points : points;
            const newPoints = Math.max(0, currentPoints + pointsChange);
            const newSolvedCount = newSolvedProblems.size;

            const { error: updateError } = await supabase
                .from('user_stats')
                .update({
                    points: newPoints,
                    solved_count: newSolvedCount,
                    solved_problems: Array.from(newSolvedProblems),
                    last_solved: isAlreadySolved ? null : new Date().toISOString()
                })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            setSolvedProblems(newSolvedProblems);
            
            toast.success(
                isAlreadySolved 
                    ? 'Problem unmarked as solved' 
                    : 'Problem marked as solved!'
            );

            return {
                newPoints,
                newSolvedCount,
                solvedProblems: Array.from(newSolvedProblems),
                wasAlreadySolved: isAlreadySolved
            };
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update problem status';
            console.error('Error updating problem status:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId, solvedProblems]);

    /**
     * Toggle revision status for a problem
     */
    const toggleRevisionStatus = useCallback(async (problemId: number) => {
        if (!userId) {
            setError('User ID is required');
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const isMarkedForRevision = revisionProblems.has(problemId);
            const newRevisionProblems = new Set(revisionProblems);

            if (isMarkedForRevision) {
                newRevisionProblems.delete(problemId);
            } else {
                newRevisionProblems.add(problemId);
            }

            const { error: updateError } = await supabase
                .from('user_stats')
                .update({
                    revision_problems: Array.from(newRevisionProblems)
                })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            setRevisionProblems(newRevisionProblems);
            
            toast.success(
                isMarkedForRevision 
                    ? 'Removed from revision list' 
                    : 'Added to revision list'
            );

            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update revision status';
            console.error('Error updating revision status:', err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [userId, revisionProblems]);

    /**
     * Check if a problem is solved
     */
    const isProblemSolved = useCallback((problemId: number) => {
        return solvedProblems.has(problemId);
    }, [solvedProblems]);

    /**
     * Check if a problem is marked for revision
     */
    const isProblemMarkedForRevision = useCallback((problemId: number) => {
        return revisionProblems.has(problemId);
    }, [revisionProblems]);

    /**
     * Get all solved problem IDs
     */
    const getSolvedProblems = useCallback(() => {
        return Array.from(solvedProblems);
    }, [solvedProblems]);

    /**
     * Get all revision problem IDs
     */
    const getRevisionProblems = useCallback(() => {
        return Array.from(revisionProblems);
    }, [revisionProblems]);

    /**
     * Reset local state
     */
    const resetState = useCallback(() => {
        setSolvedProblems(new Set());
        setRevisionProblems(new Set());
        setError(null);
        setLoading(false);
    }, []);

    return {
        solvedProblems,
        revisionProblems,
        loading,
        error,
        initializeProblems,
        updateProblemStatus,
        toggleRevisionStatus,
        isProblemSolved,
        isProblemMarkedForRevision,
        getSolvedProblems,
        getRevisionProblems,
        resetState
    };
}