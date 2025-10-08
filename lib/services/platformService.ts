// lib/services/platformService.ts
export const PLATFORMS = {
  LEETCODE: 'leetcode',
  CODEFORCES: 'codeforces',
  HACKERRANK: 'hackerrank'
} as const;

export class PlatformService {
  static async verifyProblemSolved(
    platform: string, 
    username: string, 
    problemTitle: string
  ): Promise<{ verified: boolean; message: string }> {
    if (!username) {
      return { verified: false, message: 'No username provided' };
    }

    switch(platform) {
      case PLATFORMS.LEETCODE:
        return await this.verifyLeetCodeProblem(username, problemTitle);
      case PLATFORMS.CODEFORCES:
        return { verified: false, message: 'Codeforces verification coming soon' };
      case PLATFORMS.HACKERRANK:
        return { verified: false, message: 'HackerRank verification coming soon' };
      default:
        return { verified: false, message: 'Platform not supported' };
    }
  }

  private static async verifyLeetCodeProblem(
    username: string, 
    problemTitle: string
  ): Promise<{ verified: boolean; message: string }> {
    try {
      const response = await fetch(
        `https://alfa-leetcode-api.onrender.com/${username}/submission`
      );
      
      if (!response.ok) {
        return { verified: false, message: 'Failed to fetch submissions' };
      }
      
      const data = await response.json();
      const submissions = data.submission || [];
      
      // Normalize problem title
      const normalizedTitle = problemTitle
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[()]/g, '');
      
      // Check if problem was solved
      const solved = submissions.some((sub: any) => {
        const subTitle = sub.title?.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
        return subTitle === normalizedTitle && sub.statusDisplay === 'Accepted';
      });
      
      if (solved) {
        return { verified: true, message: 'Problem verified as solved!' };
      } else {
        return { 
          verified: false, 
          message: 'Problem not found in your LeetCode submissions' 
        };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return { verified: false, message: 'Verification failed' };
    }
  }
}