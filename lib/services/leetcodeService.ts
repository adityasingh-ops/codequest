// lib/services/leetcodeService.ts
export class LeetCodeService {
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
}