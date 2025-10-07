import { User, Bot, Rocket, Cat, Dog, Bird, Fish, Squirrel, Rabbit, Turtle, Sparkles, Heart, Coffee, Trophy, Brain, Code2 } from 'lucide-react';

export const avatarIcons = [
  { id: 'user', icon: User, color: 'from-cyan-500 via-blue-500 to-purple-500' },
  { id: 'bot', icon: Bot, color: 'from-purple-500 via-pink-500 to-red-500' },
  { id: 'rocket', icon: Rocket, color: 'from-orange-500 via-red-500 to-pink-500' },
  { id: 'cat', icon: Cat, color: 'from-yellow-400 via-orange-500 to-red-500' },
  { id: 'dog', icon: Dog, color: 'from-amber-600 via-orange-700 to-red-800' },
  { id: 'bird', icon: Bird, color: 'from-sky-400 via-blue-500 to-indigo-600' },
  { id: 'fish', icon: Fish, color: 'from-cyan-400 via-teal-500 to-green-600' },
  { id: 'squirrel', icon: Squirrel, color: 'from-amber-500 via-orange-600 to-yellow-700' },
  { id: 'rabbit', icon: Rabbit, color: 'from-pink-400 via-rose-500 to-red-500' },
  { id: 'turtle', icon: Turtle, color: 'from-green-500 via-emerald-600 to-teal-700' },
  { id: 'sparkles', icon: Sparkles, color: 'from-yellow-300 via-pink-400 to-purple-500' },
  { id: 'heart', icon: Heart, color: 'from-red-500 via-pink-600 to-rose-700' },
  { id: 'coffee', icon: Coffee, color: 'from-amber-700 via-orange-800 to-brown-900' },
  { id: 'trophy', icon: Trophy, color: 'from-yellow-400 via-amber-500 to-orange-600' },
  { id: 'brain', icon: Brain, color: 'from-purple-600 via-indigo-700 to-blue-800' },
  { id: 'code', icon: Code2, color: 'from-green-400 via-teal-500 to-cyan-600' }
];

export const problemData = {
  "Beginner": {
    title: "🌱 Beginner Track",
    color: "from-green-400 to-emerald-500",
    weeks: {
      "Week 1": {
        title: "Arrays & Strings",
        days: [
          { 
            topic: "Arrays Basics", 
            problems: [
              {id: 1, title: "Two Sum", difficulty: "Easy", leetcodeNum: 1, points: 10},
              {id: 724, title: "Find Pivot Index", difficulty: "Easy", leetcodeNum: 724, points: 10},
              {id: 1480, title: "Running Sum of 1d Array", difficulty: "Easy", leetcodeNum: 1480, points: 10},
              {id: 1470, title: "Shuffle the Array", difficulty: "Easy", leetcodeNum: 1470, points: 10}
            ]
          },
          { 
            topic: "Array Operations", 
            problems: [
              {id: 121, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcodeNum: 121, points: 10},
              {id: 53, title: "Maximum Subarray", difficulty: "Easy", leetcodeNum: 53, points: 15},
              {id: 66, title: "Plus One", difficulty: "Easy", leetcodeNum: 66, points: 10}
            ]
          }
        ]
      }
    }
  },
  "Intermediate": {
    title: "🚀 Intermediate Track",
    color: "from-cyan-400 to-blue-500",
    weeks: {
      "Week 1": {
        title: "Two Pointers & Sliding Window",
        days: [
          { 
            topic: "Two Pointers Advanced", 
            problems: [
              {id: 15, title: "3Sum", difficulty: "Medium", leetcodeNum: 15, points: 25},
              {id: 11, title: "Container With Most Water", difficulty: "Medium", leetcodeNum: 11, points: 25}
            ]
          }
        ]
      }
    }
  },
  "Advanced": {
    title: "⚡ Advanced Track",
    color: "from-purple-400 to-pink-500",
    weeks: {
      "Week 1": {
        title: "Dynamic Programming",
        days: [
          { 
            topic: "DP Fundamentals", 
            problems: [
              {id: 72, title: "Edit Distance", difficulty: "Hard", leetcodeNum: 72, points: 50},
              {id: 42, title: "Trapping Rain Water", difficulty: "Hard", leetcodeNum: 42, points: 50}
            ]
          }
        ]
      }
    }
  }
};

export const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'Easy': 
      return 'text-green-400 bg-green-500/10 border-green-500/50 shadow-green-500/20';
    case 'Medium': 
      return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/50 shadow-cyan-500/20';
    case 'Hard': 
      return 'text-pink-400 bg-pink-500/10 border-pink-500/50 shadow-pink-500/20';
    default: 
      return 'text-gray-400 bg-gray-500/10 border-gray-500/50';
  }
};