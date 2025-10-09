import { useCallback } from "react";

// lib/utils/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Use in loadUserData:
export const loadUserData = useCallback(async (userId: string) => {
  if (!userId) return;

  try {
    await retryWithBackoff(async () => {
      // Your existing fetch logic here
    });
  } catch (error) {
    console.error('Failed to load user data after retries:', error);
  }
}, [userId]);