// lib/data/problemSets.ts - Multi-platform problem sets
export const PROBLEM_SETS = {
  leetcode: [
    { id: 1, title: "Two Sum", difficulty: "Easy", platformNum: 1, points: 10, platform: "leetcode", titleSlug: "two-sum" },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", platformNum: 2, points: 20, platform: "leetcode", titleSlug: "add-two-numbers" },
    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", platformNum: 3, points: 20, platform: "leetcode", titleSlug: "longest-substring-without-repeating-characters" },
    { id: 15, title: "3Sum", difficulty: "Medium", platformNum: 15, points: 20, platform: "leetcode", titleSlug: "3sum" },
    { id: 53, title: "Maximum Subarray", difficulty: "Easy", platformNum: 53, points: 15, platform: "leetcode", titleSlug: "maximum-subarray" },
    { id: 121, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", platformNum: 121, points: 15, platform: "leetcode", titleSlug: "best-time-to-buy-and-sell-stock" },
    { id: 200, title: "Number of Islands", difficulty: "Medium", platformNum: 200, points: 20, platform: "leetcode", titleSlug: "number-of-islands" },
    { id: 206, title: "Reverse Linked List", difficulty: "Easy", platformNum: 206, points: 15, platform: "leetcode", titleSlug: "reverse-linked-list" },
    { id: 146, title: "LRU Cache", difficulty: "Medium", platformNum: 146, points: 25, platform: "leetcode", titleSlug: "lru-cache" },
    { id: 42, title: "Trapping Rain Water", difficulty: "Hard", platformNum: 42, points: 30, platform: "leetcode", titleSlug: "trapping-rain-water" },
  ],
  codeforces: [
    { id: 1001, title: "A+B Problem", difficulty: "Easy", platformNum: 1, points: 10, platform: "codeforces", contestId: 4, problemLetter: "A" },
    { id: 1002, title: "Theatre Square", difficulty: "Easy", platformNum: 1, points: 15, platform: "codeforces", contestId: 1, problemLetter: "A" },
    { id: 1003, title: "Way Too Long Words", difficulty: "Easy", platformNum: 71, points: 10, platform: "codeforces", contestId: 71, problemLetter: "A" },
    { id: 1004, title: "Watermelon", difficulty: "Easy", platformNum: 4, points: 10, platform: "codeforces", contestId: 4, problemLetter: "A" },
    { id: 1005, title: "Next Round", difficulty: "Easy", platformNum: 158, points: 10, platform: "codeforces", contestId: 158, problemLetter: "A" },
    { id: 1006, title: "String Task", difficulty: "Easy", platformNum: 118, points: 10, platform: "codeforces", contestId: 118, problemLetter: "A" },
    { id: 1007, title: "Helpful Maths", difficulty: "Easy", platformNum: 339, points: 10, platform: "codeforces", contestId: 339, problemLetter: "A" },
    { id: 1008, title: "Word Capitalization", difficulty: "Easy", platformNum: 281, points: 10, platform: "codeforces", contestId: 281, problemLetter: "A" },
    { id: 1009, title: "Beautiful Matrix", difficulty: "Easy", platformNum: 263, points: 10, platform: "codeforces", contestId: 263, problemLetter: "A" },
    { id: 1010, title: "Gravity Flip", difficulty: "Easy", platformNum: 405, points: 10, platform: "codeforces", contestId: 405, problemLetter: "A" },
  ],
  codechef: [
    { id: 2001, title: "Add Two Numbers", difficulty: "Easy", platformNum: 1, points: 10, platform: "codechef", problemCode: "FLOW001" },
    { id: 2002, title: "Find Remainder", difficulty: "Easy", platformNum: 2, points: 10, platform: "codechef", problemCode: "FLOW002" },
    { id: 2003, title: "First and Last Digit", difficulty: "Easy", platformNum: 3, points: 10, platform: "codechef", problemCode: "FLOW004" },
    { id: 2004, title: "Small Factorials", difficulty: "Easy", platformNum: 4, points: 15, platform: "codechef", problemCode: "FCTRL" },
    { id: 2005, title: "ATM", difficulty: "Easy", platformNum: 5, points: 10, platform: "codechef", problemCode: "HS08TEST" },
    { id: 2006, title: "Sum of Digits", difficulty: "Easy", platformNum: 6, points: 10, platform: "codechef", problemCode: "FLOW006" },
    { id: 2007, title: "Reverse The Number", difficulty: "Easy", platformNum: 7, points: 10, platform: "codechef", problemCode: "FLOW007" },
    { id: 2008, title: "Chef and Remissness", difficulty: "Easy", platformNum: 8, points: 15, platform: "codechef", problemCode: "REMISS" },
    { id: 2009, title: "Lapindromes", difficulty: "Easy", platformNum: 9, points: 15, platform: "codechef", problemCode: "LAPIN" },
    { id: 2010, title: "Factorial", difficulty: "Easy", platformNum: 10, points: 10, platform: "codechef", problemCode: "FCTRL2" },
  ],
};

export const PLATFORM_INFO = {
  leetcode: {
    name: "LeetCode",
    color: "from-orange-500 to-yellow-600",
    icon: "💻",
    getUrl: (problem: any) => `https://leetcode.com/problems/${problem.titleSlug}/`,
  },
  codeforces: {
    name: "Codeforces",
    color: "from-blue-500 to-cyan-600",
    icon: "🏆",
    getUrl: (problem: any) => `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.problemLetter}`,
  },
  codechef: {
    name: "CodeChef",
    color: "from-brown-500 to-orange-600",
    icon: "👨‍🍳",
    getUrl: (problem: any) => `https://www.codechef.com/problems/${problem.problemCode}`,
  },
};

export const getAllProblems = () => {
  return [
    ...PROBLEM_SETS.leetcode,
    ...PROBLEM_SETS.codeforces,
    ...PROBLEM_SETS.codechef,
  ];
};

export const getProblemsByPlatform = (platform: string) => {
  return PROBLEM_SETS[platform as keyof typeof PROBLEM_SETS] || [];
};