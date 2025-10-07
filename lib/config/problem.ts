// lib/config/problems.ts (Full Beginner Track)
export const problemData = {
  Beginner: {
    title: "🌱 Beginner Track",
    color: "from-green-500 to-emerald-600",
    weeks: {
      "Week 1": {
        title: "Arrays & Strings",
        days: [
          {
            topic: "Arrays Basics",
            problems: [
              { id: 1, title: "Two Sum", difficulty: "Easy", leetcodeNum: 1, points: 10 },
              { id: 724, title: "Find Pivot Index", difficulty: "Easy", leetcodeNum: 724, points: 10 },
              { id: 1480, title: "Running Sum of 1d Array", difficulty: "Easy", leetcodeNum: 1480, points: 10 },
              { id: 1470, title: "Shuffle the Array", difficulty: "Easy", leetcodeNum: 1470, points: 10 }
            ]
          },
          {
            topic: "Array Operations",
            problems: [
              { id: 121, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcodeNum: 121, points: 10 },
              { id: 53, title: "Maximum Subarray", difficulty: "Easy", leetcodeNum: 53, points: 15 },
              { id: 66, title: "Plus One", difficulty: "Easy", leetcodeNum: 66, points: 10 }
            ]
          }
        ]
      }
    }
  },
  Intermediate: {
    title: "🚀 Intermediate Track",
    color: "from-blue-500 to-indigo-600",
    weeks: {}
  },
  Advanced: {
    title: "⚡ Advanced Track",
    color: "from-purple-500 to-pink-600",
    weeks: {}
  }
};