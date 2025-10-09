// lib/services/leetcodeService.ts
export class LeetCodeService {
      private static problemsCache: any[] | null = null;
  private static cacheTimestamp: number = 0;
  private static CACHE_DURATION = 1000 * 60 * 60; // 1 hour
  
  static calculateStreak(submissionCalendar: Record<string, number>): number {
    if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
      return 0;
    }

    const submissionDates = new Set<string>();
    Object.keys(submissionCalendar).forEach(timestamp => {
      const date = new Date(parseInt(timestamp) * 1000);
      const dateString = date.toISOString().split('T')[0];
      submissionDates.add(dateString);
    });

    const sortedDates = Array.from(submissionDates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    if (sortedDates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
      return 0;
    }

    let streak = 1;
    let currentDate = new Date(sortedDates[0]);

    for (let i = 1; i < sortedDates.length; i++) {
      const previousDate = new Date(sortedDates[i]);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);

      if (previousDate.toISOString().split('T')[0] === 
          expectedDate.toISOString().split('T')[0]) {
        streak++;
        currentDate = previousDate;
      } else {
        break;
      }
    }

    return streak;
  }

  static async fetchUserStats(username: string) {
    try {
      const [userInfoRes, userProfileRes, calendarRes] = await Promise.all([
        fetch(`https://alfa-leetcode-api.onrender.com/${username}`),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)
      ]);

      if (!userInfoRes.ok || !userProfileRes.ok || !calendarRes.ok) {
        throw new Error('User not found or API error');
      }

      const userInfo = await userInfoRes.json();
      const userProfile = await userProfileRes.json();
      const calendar = await calendarRes.json();

      const currentStreak = this.calculateStreak(calendar.submissionCalendar);
      const totalActiveDays = Object.keys(calendar.submissionCalendar || {}).length;

      return {
        username: username,
        realName: userInfo.name || username,
        ranking: userInfo.ranking || 0,
        reputation: userInfo.reputation || 0,
        solved: {
          easy: userProfile.easySolved || 0,
          medium: userProfile.mediumSolved || 0,
          hard: userProfile.hardSolved || 0,
          all: userProfile.solvedProblem || 0
        },
        submissions: {
          easy: userProfile.easySolved || 0,
          medium: userProfile.mediumSolved || 0,
          hard: userProfile.hardSolved || 0,
          all: userProfile.totalSubmissionNum?.[0]?.count || 0
        },
        calendar: {
          streak: currentStreak,
          totalActiveDays: totalActiveDays,
          submissionCalendar: calendar.submissionCalendar || {}
        },
        contestRanking: {
          attendedContestsCount: userInfo.contestAttend || 0,
          rating: Math.round(userInfo.contestRating || 0),
          globalRanking: userInfo.contestGlobalRanking || 0,
          topPercentage: userInfo.contestTopPercentage?.toFixed(2) || '0.00'
        },
        badges: userInfo.badges?.map((badge: any) => ({
          displayName: badge.displayName || badge.name,
          icon: badge.icon || '🏆'
        })) || [],
        recentSubmissions: userInfo.recentSubmissions?.slice(0, 10) || [],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      throw error;
    }
  }
  

static async getAllProblems(): Promise<any[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.problemsCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.problemsCache;
    }

    try {
      const response = await fetch('https://alfa-leetcode-api.onrender.com/problems?limit=3500');
      
      if (!response.ok) {
        throw new Error('Failed to fetch problems list');
      }

      const data = await response.json();
      this.problemsCache = data.problemsetQuestionList || [];
      this.cacheTimestamp = now;

      // Ensure problemsCache is always an array, never null
      return this.problemsCache ?? [];
    } catch (error) {
      console.error('Error fetching all problems:', error);
      // If problemsCache is null, return empty array to satisfy type
      return this.problemsCache ?? [];
    }
  }

  static async fetchProblemDetails(problemNumber: number): Promise<{
    id: number;
    title: string;
    titleSlug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    exists: boolean;
  }> {
    try {
      const allProblems = await this.getAllProblems();
      
      const problem = allProblems.find(
        (p: any) => p.frontendQuestionId === String(problemNumber)
      );

      if (problem) {
        return {
          id: problemNumber,
          title: problem.title,
          titleSlug: problem.titleSlug,
          difficulty: problem.difficulty as 'Easy' | 'Medium' | 'Hard',
          exists: true
        };
      }

      console.warn(`Problem ${problemNumber} not found in LeetCode database`);
      return {
        id: problemNumber,
        title: `Problem ${problemNumber}`,
        titleSlug: String(problemNumber),
        difficulty: 'Medium',
        exists: false
      };
    } catch (error) {
      console.error(`Error fetching problem ${problemNumber}:`, error);
      return {
        id: problemNumber,
        title: `Problem ${problemNumber}`,
        titleSlug: String(problemNumber),
        difficulty: 'Medium',
        exists: false
      };
    }
  }

  static async validateAndFetchProblems(problemNumbers: number[]): Promise<{
    validProblems: any[];
    invalidProblems: number[];
  }> {
    console.log('Validating problems:', problemNumbers);
    
    // Fetch all problems once at the beginning
    await this.getAllProblems();
    
    const results = await Promise.allSettled(
      problemNumbers.map(num => this.fetchProblemDetails(num))
    );

    const validProblems: any[] = [];
    const invalidProblems: number[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.exists) {
        const problem = result.value;
        validProblems.push({
          id: parseInt(`${Date.now()}${index}`),
          title: problem.title,
          titleSlug: problem.titleSlug,
          difficulty: problem.difficulty,
          leetcodeNum: problem.id,
          points: problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 15 : 20,
          link: `https://leetcode.com/problems/${problem.titleSlug}/`
        });
        console.log(`✓ Problem ${problemNumbers[index]}: ${problem.title}`);
      } else {
        invalidProblems.push(problemNumbers[index]);
        console.log(`✗ Problem ${problemNumbers[index]}: Not found`);
      }
    });

    console.log('Validation complete:', { validProblems: validProblems.length, invalidProblems });
    return { validProblems, invalidProblems };
  }
}