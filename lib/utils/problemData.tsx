// lib/utils/problemData.ts
export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeNum: number;
  points: number;
}

export interface Day {
  topic: string;
  problems: Problem[];
}

export interface Week {
  title: string;
  days: Day[];
}

export interface TrackData {
  title: string;
  color: string;
  weeks: Record<string, Week>;
  isCustom?: boolean;
}
export const problemData = {
  "Beginner": {
    title: "🌱 Beginner Track",
    color: "from-green-500 to-emerald-600",
    weeks: {
      "Week 1": {
        title: "Arrays & Strings",
        days: [
          { topic: "Arrays Basics", problems: [
            {id: 1, title: "Two Sum", difficulty: "Easy", leetcodeNum: 1, points: 10},
            {id: 724, title: "Find Pivot Index", difficulty: "Easy", leetcodeNum: 724, points: 10},
            {id: 1480, title: "Running Sum of 1d Array", difficulty: "Easy", leetcodeNum: 1480, points: 10},
            {id: 1470, title: "Shuffle the Array", difficulty: "Easy", leetcodeNum: 1470, points: 10}
          ]},
          { topic: "Array Operations", problems: [
            {id: 121, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcodeNum: 121, points: 10},
            {id: 53, title: "Maximum Subarray", difficulty: "Easy", leetcodeNum: 53, points: 15},
            {id: 66, title: "Plus One", difficulty: "Easy", leetcodeNum: 66, points: 10}
          ]},
          { topic: "Two Pointers Intro", problems: [
            {id: 26, title: "Remove Duplicates from Sorted Array", difficulty: "Easy", leetcodeNum: 26, points: 10},
            {id: 27, title: "Remove Element", difficulty: "Easy", leetcodeNum: 27, points: 10},
            {id: 88, title: "Merge Sorted Array", difficulty: "Easy", leetcodeNum: 88, points: 10},
            {id: 977, title: "Squares of a Sorted Array", difficulty: "Easy", leetcodeNum: 977, points: 10}
          ]},
          { topic: "Two Pointers Practice", problems: [
            {id: 125, title: "Valid Palindrome", difficulty: "Easy", leetcodeNum: 125, points: 10},
            {id: 167, title: "Two Sum II Input Array Is Sorted", difficulty: "Easy", leetcodeNum: 167, points: 10},
            {id: 283, title: "Move Zeroes", difficulty: "Easy", leetcodeNum: 283, points: 10}
          ]},
          { topic: "String Basics", problems: [
            {id: 344, title: "Reverse String", difficulty: "Easy", leetcodeNum: 344, points: 10},
            {id: 387, title: "First Unique Character in a String", difficulty: "Easy", leetcodeNum: 387, points: 10},
            {id: 242, title: "Valid Anagram", difficulty: "Easy", leetcodeNum: 242, points: 10},
            {id: 383, title: "Ransom Note", difficulty: "Easy", leetcodeNum: 383, points: 10}
          ]},
          { topic: "String Operations", problems: [
            {id: 14, title: "Longest Common Prefix", difficulty: "Easy", leetcodeNum: 14, points: 10},
            {id: 58, title: "Length of Last Word", difficulty: "Easy", leetcodeNum: 58, points: 10},
            {id: 28, title: "Implement strStr", difficulty: "Easy", leetcodeNum: 28, points: 10}
          ]},
          { topic: "Week 1 Mixed", problems: [
            {id: 557, title: "Reverse Words in a String III", difficulty: "Easy", leetcodeNum: 557, points: 10},
            {id: 217, title: "Contains Duplicate", difficulty: "Easy", leetcodeNum: 217, points: 10},
            {id: 136, title: "Single Number", difficulty: "Easy", leetcodeNum: 136, points: 10},
            {id: 268, title: "Missing Number", difficulty: "Easy", leetcodeNum: 268, points: 10}
          ]}
        ]
      },
      "Week 2": {
        title: "Linked Lists & Basic Data Structures",
        days: [
          { topic: "Linked List Basics", problems: [
            {id: 206, title: "Reverse Linked List", difficulty: "Easy", leetcodeNum: 206, points: 15},
            {id: 876, title: "Middle of the Linked List", difficulty: "Easy", leetcodeNum: 876, points: 10},
            {id: 237, title: "Delete Node in a Linked List", difficulty: "Easy", leetcodeNum: 237, points: 10}
          ]},
          { topic: "Linked List Operations", problems: [
            {id: 21, title: "Merge Two Sorted Lists", difficulty: "Easy", leetcodeNum: 21, points: 15},
            {id: 141, title: "Linked List Cycle", difficulty: "Easy", leetcodeNum: 141, points: 15},
            {id: 203, title: "Remove Linked List Elements", difficulty: "Easy", leetcodeNum: 203, points: 10},
            {id: 83, title: "Remove Duplicates from Sorted List", difficulty: "Easy", leetcodeNum: 83, points: 10}
          ]},
          { topic: "Linked List Advanced", problems: [
            {id: 234, title: "Palindrome Linked List", difficulty: "Easy", leetcodeNum: 234, points: 15},
            {id: 160, title: "Intersection of Two Linked Lists", difficulty: "Easy", leetcodeNum: 160, points: 15},
            {id: 2, title: "Add Two Numbers", difficulty: "Medium", leetcodeNum: 2, points: 20}
          ]},
          { topic: "Stack Basics", problems: [
            {id: 20, title: "Valid Parentheses", difficulty: "Easy", leetcodeNum: 20, points: 10},
            {id: 225, title: "Implement Stack using Queues", difficulty: "Easy", leetcodeNum: 225, points: 15},
            {id: 682, title: "Baseball Game", difficulty: "Easy", leetcodeNum: 682, points: 10},
            {id: 496, title: "Next Greater Element I", difficulty: "Easy", leetcodeNum: 496, points: 15}
          ]},
          { topic: "Stack Applications", problems: [
            {id: 155, title: "Min Stack", difficulty: "Easy", leetcodeNum: 155, points: 15},
            {id: 844, title: "Backspace String Compare", difficulty: "Easy", leetcodeNum: 844, points: 10},
            {id: 739, title: "Daily Temperatures", difficulty: "Medium", leetcodeNum: 739, points: 20}
          ]},
          { topic: "Queue Basics", problems: [
            {id: 232, title: "Implement Queue using Stacks", difficulty: "Easy", leetcodeNum: 232, points: 15},
            {id: 622, title: "Design Circular Queue", difficulty: "Medium", leetcodeNum: 622, points: 20},
            {id: 933, title: "Number of Recent Calls", difficulty: "Easy", leetcodeNum: 933, points: 10}
          ]},
          { topic: "Week 2 Review", problems: [
            {id: 19, title: "Remove Nth Node From End of List", difficulty: "Medium", leetcodeNum: 19, points: 20},
            {id: 1603, title: "Design Parking System", difficulty: "Easy", leetcodeNum: 1603, points: 10},
            {id: 1614, title: "Maximum Nesting Depth of Parentheses", difficulty: "Easy", leetcodeNum: 1614, points: 10}
          ]}
        ]
      },
      "Week 3": {
        title: "Trees Introduction",
        days: [
          { topic: "Binary Tree Basics", problems: [
            {id: 104, title: "Maximum Depth of Binary Tree", difficulty: "Easy", leetcodeNum: 104, points: 10},
            {id: 226, title: "Invert Binary Tree", difficulty: "Easy", leetcodeNum: 226, points: 15},
            {id: 100, title: "Same Tree", difficulty: "Easy", leetcodeNum: 100, points: 10}
          ]},
          { topic: "Tree Traversals", problems: [
            {id: 94, title: "Binary Tree Inorder Traversal", difficulty: "Easy", leetcodeNum: 94, points: 10},
            {id: 144, title: "Binary Tree Preorder Traversal", difficulty: "Easy", leetcodeNum: 144, points: 10},
            {id: 145, title: "Binary Tree Postorder Traversal", difficulty: "Easy", leetcodeNum: 145, points: 10},
            {id: 112, title: "Path Sum", difficulty: "Easy", leetcodeNum: 112, points: 10}
          ]},
          { topic: "Tree Properties", problems: [
            {id: 101, title: "Symmetric Tree", difficulty: "Easy", leetcodeNum: 101, points: 10},
            {id: 543, title: "Diameter of Binary Tree", difficulty: "Easy", leetcodeNum: 543, points: 10},
            {id: 110, title: "Balanced Binary Tree", difficulty: "Easy", leetcodeNum: 110, points: 10}
          ]},
          { topic: "Tree Algorithms", problems: [
            {id: 617, title: "Merge Two Binary Trees", difficulty: "Easy", leetcodeNum: 617, points: 10},
            {id: 102, title: "Binary Tree Level Order Traversal", difficulty: "Medium", leetcodeNum: 102, points: 15},
            {id: 111, title: "Minimum Depth of Binary Tree", difficulty: "Easy", leetcodeNum: 111, points: 10},
            {id: 404, title: "Sum of Left Leaves", difficulty: "Easy", leetcodeNum: 404, points: 10}
          ]},
          { topic: "BST Basics", problems: [
            {id: 700, title: "Search in a Binary Search Tree", difficulty: "Easy", leetcodeNum: 700, points: 10},
            {id: 701, title: "Insert into a Binary Search Tree", difficulty: "Medium", leetcodeNum: 701, points: 15},
            {id: 938, title: "Range Sum of BST", difficulty: "Easy", leetcodeNum: 938, points: 10}
          ]},
          { topic: "BST Operations", problems: [
            {id: 98, title: "Validate Binary Search Tree", difficulty: "Medium", leetcodeNum: 98, points: 15},
            {id: 653, title: "Two Sum IV Input is a BST", difficulty: "Easy", leetcodeNum: 653, points: 10},
            {id: 235, title: "Lowest Common Ancestor of a Binary Search Tree", difficulty: "Easy", leetcodeNum: 235, points: 10}
          ]},
          { topic: "Week 3 Practice", problems: [
            {id: 108, title: "Convert Sorted Array to Binary Search Tree", difficulty: "Easy", leetcodeNum: 108, points: 10},
            {id: 257, title: "Binary Tree Paths", difficulty: "Easy", leetcodeNum: 257, points: 10},
            {id: 501, title: "Find Mode in Binary Search Tree", difficulty: "Easy", leetcodeNum: 501, points: 10}
          ]}
        ]
      },
      "Week 4": {
        title: "Sorting & Searching",
        days: [
          { topic: "Sorting Basics", problems: [
            {id: 75, title: "Sort Colors", difficulty: "Medium", leetcodeNum: 75, points: 15},
            {id: 905, title: "Sort Array By Parity", difficulty: "Easy", leetcodeNum: 905, points: 10},
            {id: 922, title: "Sort Array By Parity II", difficulty: "Easy", leetcodeNum: 922, points: 10}
          ]},
          { topic: "Sorting Applications", problems: [
            {id: 252, title: "Meeting Rooms", difficulty: "Easy", leetcodeNum: 252, points: 10},
            {id: 179, title: "Largest Number", difficulty: "Medium", leetcodeNum: 179, points: 15},
            {id: 1122, title: "Relative Sort Array", difficulty: "Easy", leetcodeNum: 1122, points: 10},
            {id: 1051, title: "Height Checker", difficulty: "Easy", leetcodeNum: 1051, points: 10}
          ]},
          { topic: "Binary Search Basics", problems: [
            {id: 704, title: "Binary Search", difficulty: "Easy", leetcodeNum: 704, points: 10},
            {id: 35, title: "Search Insert Position", difficulty: "Easy", leetcodeNum: 35, points: 10},
            {id: 278, title: "First Bad Version", difficulty: "Easy", leetcodeNum: 278, points: 10}
          ]},
          { topic: "Binary Search Applications", problems: [
            {id: 34, title: "Find First and Last Position of Element", difficulty: "Medium", leetcodeNum: 34, points: 15},
            {id: 852, title: "Peak Index in a Mountain Array", difficulty: "Easy", leetcodeNum: 852, points: 10},
            {id: 367, title: "Valid Perfect Square", difficulty: "Easy", leetcodeNum: 367, points: 10},
            {id: 69, title: "Sqrt x", difficulty: "Easy", leetcodeNum: 69, points: 10}
          ]},
          { topic: "Advanced Binary Search", problems: [
            {id: 33, title: "Search in Rotated Sorted Array", difficulty: "Medium", leetcodeNum: 33, points: 15},
            {id: 153, title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", leetcodeNum: 153, points: 15},
            {id: 74, title: "Search a 2D Matrix", difficulty: "Medium", leetcodeNum: 74, points: 15}
          ]},
          { topic: "Binary Search Practice", problems: [
            {id: 374, title: "Guess Number Higher or Lower", difficulty: "Easy", leetcodeNum: 374, points: 10},
            {id: 441, title: "Arranging Coins", difficulty: "Easy", leetcodeNum: 441, points: 10},
            {id: 162, title: "Find Peak Element", difficulty: "Medium", leetcodeNum: 162, points: 15}
          ]},
          { topic: "Week 4 Review", problems: [
            {id: 875, title: "Koko Eating Bananas", difficulty: "Medium", leetcodeNum: 875, points: 15},
            {id: 1011, title: "Capacity To Ship Packages Within D Days", difficulty: "Medium", leetcodeNum: 1011, points: 15},
            {id: 981, title: "Time Based Key Value Store", difficulty: "Medium", leetcodeNum: 981, points: 15}
          ]}
        ]
      },
      "Week 5": {
        title: "Hash Maps & Two Pointers Advanced",
        days: [
          { topic: "HashMap Basics", problems: [
            {id: 1001, title: "Two Sum", difficulty: "Easy", leetcodeNum: 1, points: 10},
            {id: 49, title: "Group Anagrams", difficulty: "Medium", leetcodeNum: 49, points: 15},
            {id: 219, title: "Contains Duplicate II", difficulty: "Easy", leetcodeNum: 219, points: 10}
          ]},
          { topic: "HashMap Applications", problems: [
            {id: 350, title: "Intersection of Two Arrays II", difficulty: "Easy", leetcodeNum: 350, points: 10},
            {id: 202, title: "Happy Number", difficulty: "Easy", leetcodeNum: 202, points: 10},
            {id: 560, title: "Subarray Sum Equals K", difficulty: "Medium", leetcodeNum: 560, points: 15},
            {id: 454, title: "4Sum II", difficulty: "Medium", leetcodeNum: 454, points: 15}
          ]},
          { topic: "Two Pointers Advanced", problems: [
            {id: 15, title: "3Sum", difficulty: "Medium", leetcodeNum: 15, points: 15},
            {id: 16, title: "3Sum Closest", difficulty: "Medium", leetcodeNum: 16, points: 15},
            {id: 11, title: "Container With Most Water", difficulty: "Medium", leetcodeNum: 11, points: 15}
          ]},
          { topic: "Two Pointers + Arrays", problems: [
            {id: 18, title: "4Sum", difficulty: "Medium", leetcodeNum: 18, points: 15},
            {id: 42, title: "Trapping Rain Water", difficulty: "Hard", leetcodeNum: 42, points: 20},
            {id: 75001, title: "Sort Colors", difficulty: "Medium", leetcodeNum: 75, points: 15}
          ]},
          { topic: "Pattern Practice", problems: [
            {id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", leetcodeNum: 5, points: 15},
            {id: 647, title: "Palindromic Substrings", difficulty: "Medium", leetcodeNum: 647, points: 15},
            {id: 680, title: "Valid Palindrome II", difficulty: "Easy", leetcodeNum: 680, points: 10},
            {id: 409, title: "Longest Palindrome", difficulty: "Easy", leetcodeNum: 409, points: 10}
          ]},
          { topic: "Mixed Practice", problems: [
            {id: 238, title: "Product of Array Except Self", difficulty: "Medium", leetcodeNum: 238, points: 15},
            {id: 347, title: "Top K Frequent Elements", difficulty: "Medium", leetcodeNum: 347, points: 15},
            {id: 448, title: "Find All Numbers Disappeared in Array", difficulty: "Easy", leetcodeNum: 448, points: 10}
          ]},
          { topic: "Week 5 Review", problems: [
            {id: 128, title: "Longest Consecutive Sequence", difficulty: "Medium", leetcodeNum: 128, points: 15},
            {id: 380, title: "Insert Delete GetRandom O 1", difficulty: "Medium", leetcodeNum: 380, points: 15},
            {id: 41, title: "First Missing Positive", difficulty: "Hard", leetcodeNum: 41, points: 20}
          ]}
        ]
      },
      "Week 6": {
        title: "Sliding Window & Foundation Complete",
        days: [
          { topic: "Sliding Window Basics", problems: [
            {id: 643, title: "Maximum Average Subarray I", difficulty: "Easy", leetcodeNum: 643, points: 10},
            {id: 220, title: "Contains Duplicate III", difficulty: "Medium", leetcodeNum: 220, points: 15},
            {id: 209, title: "Minimum Size Subarray Sum", difficulty: "Medium", leetcodeNum: 209, points: 15}
          ]},
          { topic: "Variable Window", problems: [
            {id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", leetcodeNum: 3, points: 15},
            {id: 424, title: "Longest Repeating Character Replacement", difficulty: "Medium", leetcodeNum: 424, points: 15},
            {id: 567, title: "Permutation in String", difficulty: "Medium", leetcodeNum: 567, points: 15}
          ]},
          { topic: "Window + HashMap", problems: [
            {id: 438, title: "Find All Anagrams in a String", difficulty: "Medium", leetcodeNum: 438, points: 15},
            {id: 76, title: "Minimum Window Substring", difficulty: "Hard", leetcodeNum: 76, points: 20},
            {id: 30, title: "Substring with Concatenation of All Words", difficulty: "Hard", leetcodeNum: 30, points: 20}
          ]},
          { topic: "Advanced Window", problems: [
            {id: 1004, title: "Max Consecutive Ones III", difficulty: "Medium", leetcodeNum: 1004, points: 15},
            {id: 904, title: "Fruit Into Baskets", difficulty: "Medium", leetcodeNum: 904, points: 15},
            {id: 340, title: "Longest Substring with At Most K Distinct Characters", difficulty: "Medium", leetcodeNum: 340, points: 15},
            {id: 992, title: "Subarrays with K Different Integers", difficulty: "Hard", leetcodeNum: 992, points: 20}
          ]},
          { topic: "Window Practice", problems: [
            {id: 1456, title: "Maximum Number of Vowels in Substring", difficulty: "Medium", leetcodeNum: 1456, points: 15},
            {id: 1208, title: "Get Equal Substrings Within Budget", difficulty: "Medium", leetcodeNum: 1208, points: 15},
            {id: 239, title: "Sliding Window Maximum", difficulty: "Hard", leetcodeNum: 239, points: 20}
          ]},
          { topic: "Mixed Algorithms", problems: [
            {id: 713, title: "Subarray Product Less Than K", difficulty: "Medium", leetcodeNum: 713, points: 15},
            {id: 930, title: "Binary Subarrays With Sum", difficulty: "Medium", leetcodeNum: 930, points: 15},
            {id: 795, title: "Number of Subarrays with Bounded Maximum", difficulty: "Medium", leetcodeNum: 795, points: 15}
          ]},
          { topic: "Foundation Review", problems: [
            {id: 845, title: "Longest Mountain in Array", difficulty: "Medium", leetcodeNum: 845, points: 15},
            {id: 442, title: "Find All Duplicates in an Array", difficulty: "Medium", leetcodeNum: 442, points: 15},
            {id: 73, title: "Set Matrix Zeroes", difficulty: "Medium", leetcodeNum: 73, points: 15},
            {id: 54, title: "Spiral Matrix", difficulty: "Medium", leetcodeNum: 54, points: 15}
          ]}
        ]
      }
    }
  },
  "Intermediate": {
    title: "🚀 Intermediate Track",
    color: "from-blue-500 to-indigo-600",
    weeks: {
      "Week 1": {
        title: "Two Pointers & Sliding Window",
        days: [
          { topic: "Two Pointers Advanced", problems: [
            {id: 15001, title: "3Sum", difficulty: "Medium", leetcodeNum: 15, points: 25},
            {id: 11001, title: "Container With Most Water", difficulty: "Medium", leetcodeNum: 11, points: 25}
          ]},
          { topic: "Sliding Window", problems: [
            {id: 3001, title: "Longest Substring Without Repeating", difficulty: "Medium", leetcodeNum: 3, points: 30},
            {id: 438001, title: "Find All Anagrams in a String", difficulty: "Medium", leetcodeNum: 438, points: 30}
          ]}
        ]
      },
      "Week 2": {
        title: "Trees & Graphs",
        days: [
          { topic: "Binary Trees", problems: [
            {id: 102001, title: "Binary Tree Level Order Traversal", difficulty: "Medium", leetcodeNum: 102, points: 30},
            {id: 98001, title: "Validate Binary Search Tree", difficulty: "Medium", leetcodeNum: 98, points: 35}
          ]}
        ]
      }
    }
  },
  "Advanced": {
    title: "⚡ Advanced Track",
    color: "from-purple-500 to-pink-600",
    weeks: {
      "Week 1": {
        title: "Dynamic Programming",
        days: [
          { topic: "DP Fundamentals", problems: [
            {id: 72001, title: "Edit Distance", difficulty: "Hard", leetcodeNum: 72, points: 50},
            {id: 42001, title: "Trapping Rain Water", difficulty: "Hard", leetcodeNum: 42, points: 50},
            {id: 76001, title: "Minimum Window Substring", difficulty: "Hard", leetcodeNum: 76, points: 50}
          ]}
        ]
      }
    }
  }
};

export const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
};