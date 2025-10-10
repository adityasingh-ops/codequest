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
        title: "Advanced Arrays & Two Pointers",
        days: [
          { topic: "Two Pointers Mastery", problems: [
            {id: 15001, title: "3Sum", difficulty: "Medium", leetcodeNum: 15, points: 25},
            {id: 16001, title: "3Sum Closest", difficulty: "Medium", leetcodeNum: 16, points: 25},
            {id: 259001, title: "3Sum Smaller", difficulty: "Medium", leetcodeNum: 259, points: 25}
          ]},
          { topic: "Container Problems", problems: [
            {id: 11001, title: "Container With Most Water", difficulty: "Medium", leetcodeNum: 11, points: 25},
            {id: 42002, title: "Trapping Rain Water", difficulty: "Hard", leetcodeNum: 42, points: 30},
            {id: 407001, title: "Trapping Rain Water II", difficulty: "Hard", leetcodeNum: 407, points: 35}
          ]},
          { topic: "Advanced Sliding Window", problems: [
            {id: 76002, title: "Minimum Window Substring", difficulty: "Hard", leetcodeNum: 76, points: 30},
            {id: 239001, title: "Sliding Window Maximum", difficulty: "Hard", leetcodeNum: 239, points: 30}
          ]},
          { topic: "Monotonic Stack", problems: [
            {id: 84001, title: "Largest Rectangle in Histogram", difficulty: "Hard", leetcodeNum: 84, points: 35},
            {id: 85001, title: "Maximal Rectangle", difficulty: "Hard", leetcodeNum: 85, points: 35}
          ]},
          { topic: "Array Math", problems: [
            {id: 238001, title: "Product of Array Except Self", difficulty: "Medium", leetcodeNum: 238, points: 25},
            {id: 48001, title: "Rotate Image", difficulty: "Medium", leetcodeNum: 48, points: 25},
            {id: 54001, title: "Spiral Matrix", difficulty: "Medium", leetcodeNum: 54, points: 25}
          ]},
          { topic: "Intervals", problems: [
            {id: 56001, title: "Merge Intervals", difficulty: "Medium", leetcodeNum: 56, points: 25},
            {id: 57001, title: "Insert Interval", difficulty: "Medium", leetcodeNum: 57, points: 25},
            {id: 435001, title: "Non-overlapping Intervals", difficulty: "Medium", leetcodeNum: 435, points: 25}
          ]},
          { topic: "Week 1 Challenge", problems: [
            {id: 287001, title: "Find the Duplicate Number", difficulty: "Medium", leetcodeNum: 287, points: 30},
            {id: 41001, title: "First Missing Positive", difficulty: "Hard", leetcodeNum: 41, points: 35}
          ]}
        ]
      },
      "Week 2": {
        title: "Advanced Trees & Recursion",
        days: [
          { topic: "Tree Construction", problems: [
            {id: 105001, title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", leetcodeNum: 105, points: 30},
            {id: 106001, title: "Construct Binary Tree from Inorder and Postorder", difficulty: "Medium", leetcodeNum: 106, points: 30}
          ]},
          { topic: "LCA Problems", problems: [
            {id: 236001, title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", leetcodeNum: 236, points: 30},
            {id: 1644001, title: "LCA of Binary Tree II", difficulty: "Medium", leetcodeNum: 1644, points: 30},
            {id: 1650001, title: "LCA of Binary Tree III", difficulty: "Medium", leetcodeNum: 1650, points: 30}
          ]},
          { topic: "Path Problems", problems: [
            {id: 113001, title: "Path Sum II", difficulty: "Medium", leetcodeNum: 113, points: 25},
            {id: 437001, title: "Path Sum III", difficulty: "Medium", leetcodeNum: 437, points: 30},
            {id: 124001, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", leetcodeNum: 124, points: 35}
          ]},
          { topic: "Serialization", problems: [
            {id: 297001, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", leetcodeNum: 297, points: 35},
            {id: 449001, title: "Serialize and Deserialize BST", difficulty: "Medium", leetcodeNum: 449, points: 30}
          ]},
          { topic: "BST Operations", problems: [
            {id: 450001, title: "Delete Node in a BST", difficulty: "Medium", leetcodeNum: 450, points: 30},
            {id: 230001, title: "Kth Smallest Element in a BST", difficulty: "Medium", leetcodeNum: 230, points: 25},
            {id: 99001, title: "Recover Binary Search Tree", difficulty: "Medium", leetcodeNum: 99, points: 30}
          ]},
          { topic: "Advanced Tree", problems: [
            {id: 114001, title: "Flatten Binary Tree to Linked List", difficulty: "Medium", leetcodeNum: 114, points: 25},
            {id: 116001, title: "Populating Next Right Pointers", difficulty: "Medium", leetcodeNum: 116, points: 25}
          ]},
          { topic: "Week 2 Challenge", problems: [
            {id: 222001, title: "Count Complete Tree Nodes", difficulty: "Medium", leetcodeNum: 222, points: 30},
            {id: 979001, title: "Distribute Coins in Binary Tree", difficulty: "Medium", leetcodeNum: 979, points: 30}
          ]}
        ]
      },
      "Week 3": {
        title: "Dynamic Programming - Foundation (1D DP)",
        days: [
          { topic: "DP Introduction", problems: [
            {id: 70001, title: "Climbing Stairs", difficulty: "Easy", leetcodeNum: 70, points: 20},
            {id: 509001, title: "Fibonacci Number", difficulty: "Easy", leetcodeNum: 509, points: 15},
            {id: 1137001, title: "N-th Tribonacci Number", difficulty: "Easy", leetcodeNum: 1137, points: 20},
            {id: 746001, title: "Min Cost Climbing Stairs", difficulty: "Easy", leetcodeNum: 746, points: 20}
          ]},
          { topic: "House Robber Pattern", problems: [
            {id: 198001, title: "House Robber", difficulty: "Medium", leetcodeNum: 198, points: 25},
            {id: 740001, title: "Delete and Earn", difficulty: "Medium", leetcodeNum: 740, points: 30},
            {id: 2320001, title: "Count Number of Ways to Place Houses", difficulty: "Medium", leetcodeNum: 2320, points: 30}
          ]},
          { topic: "Jump Game Pattern", problems: [
            {id: 55001, title: "Jump Game", difficulty: "Medium", leetcodeNum: 55, points: 25},
            {id: 45001, title: "Jump Game II", difficulty: "Medium", leetcodeNum: 45, points: 30},
            {id: 1306001, title: "Jump Game III", difficulty: "Medium", leetcodeNum: 1306, points: 30}
          ]},
          { topic: "Decode Ways Pattern", problems: [
            {id: 91001, title: "Decode Ways", difficulty: "Medium", leetcodeNum: 91, points: 30},
            {id: 639001, title: "Decode Ways II", difficulty: "Hard", leetcodeNum: 639, points: 35}
          ]},
          { topic: "Partition Problems", problems: [
            {id: 139001, title: "Word Break", difficulty: "Medium", leetcodeNum: 139, points: 30},
            {id: 279001, title: "Perfect Squares", difficulty: "Medium", leetcodeNum: 279, points: 25},
            {id: 322001, title: "Coin Change", difficulty: "Medium", leetcodeNum: 322, points: 30}
          ]},
          { topic: "1D DP Mastery", problems: [
            {id: 300001, title: "Longest Increasing Subsequence", difficulty: "Medium", leetcodeNum: 300, points: 30},
            {id: 673001, title: "Number of Longest Increasing Subsequence", difficulty: "Medium", leetcodeNum: 673, points: 30}
          ]},
          { topic: "Week 3 Challenge", problems: [
            {id: 152001, title: "Maximum Product Subarray", difficulty: "Medium", leetcodeNum: 152, points: 30},
            {id: 918001, title: "Maximum Sum Circular Subarray", difficulty: "Medium", leetcodeNum: 918, points: 30}
          ]}
        ]
      },
      "Week 4": {
        title: "Dynamic Programming - 2D DP & Strings",
        days: [
          { topic: "Grid DP Basics", problems: [
            {id: 62001, title: "Unique Paths", difficulty: "Medium", leetcodeNum: 62, points: 25},
            {id: 63001, title: "Unique Paths II", difficulty: "Medium", leetcodeNum: 63, points: 25},
            {id: 64001, title: "Minimum Path Sum", difficulty: "Medium", leetcodeNum: 64, points: 25}
          ]},
          { topic: "Grid DP Advanced", problems: [
            {id: 120001, title: "Triangle", difficulty: "Medium", leetcodeNum: 120, points: 25},
            {id: 931001, title: "Minimum Falling Path Sum", difficulty: "Medium", leetcodeNum: 931, points: 25},
            {id: 221001, title: "Maximal Square", difficulty: "Medium", leetcodeNum: 221, points: 30}
          ]},
          { topic: "Subsequence DP", problems: [
            {id: 1143001, title: "Longest Common Subsequence", difficulty: "Medium", leetcodeNum: 1143, points: 30},
            {id: 1092001, title: "Shortest Common Supersequence", difficulty: "Hard", leetcodeNum: 1092, points: 35}
          ]},
          { topic: "String Matching DP", problems: [
            {id: 72001, title: "Edit Distance", difficulty: "Hard", leetcodeNum: 72, points: 35},
            {id: 97001, title: "Interleaving String", difficulty: "Medium", leetcodeNum: 97, points: 30},
            {id: 44001, title: "Wildcard Matching", difficulty: "Hard", leetcodeNum: 44, points: 35}
          ]},
          { topic: "Distinct Subsequences", problems: [
            {id: 115001, title: "Distinct Subsequences", difficulty: "Hard", leetcodeNum: 115, points: 35},
            {id: 940001, title: "Distinct Subsequences II", difficulty: "Hard", leetcodeNum: 940, points: 35}
          ]},
          { topic: "Palindrome DP", problems: [
            {id: 516001, title: "Longest Palindromic Subsequence", difficulty: "Medium", leetcodeNum: 516, points: 30},
            {id: 1312001, title: "Minimum Insertion Steps Palindrome", difficulty: "Hard", leetcodeNum: 1312, points: 35}
          ]},
          { topic: "Week 4 Challenge", problems: [
            {id: 10001, title: "Regular Expression Matching", difficulty: "Hard", leetcodeNum: 10, points: 40}
          ]}
        ]
      },
      "Week 5": {
        title: "Dynamic Programming - Advanced Patterns",
        days: [
          { topic: "Stock Problems", problems: [
            {id: 121001, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcodeNum: 121, points: 20},
            {id: 122001, title: "Best Time to Buy and Sell Stock II", difficulty: "Medium", leetcodeNum: 122, points: 25},
            {id: 123001, title: "Best Time to Buy and Sell Stock III", difficulty: "Hard", leetcodeNum: 123, points: 35},
            {id: 188001, title: "Best Time to Buy and Sell Stock IV", difficulty: "Hard", leetcodeNum: 188, points: 35}
          ]},
          { topic: "Stock with Cooldown", problems: [
            {id: 309001, title: "Best Time Buy Sell Stock with Cooldown", difficulty: "Medium", leetcodeNum: 309, points: 30},
            {id: 714001, title: "Best Time Buy Sell Stock with Fee", difficulty: "Medium", leetcodeNum: 714, points: 30}
          ]},
          { topic: "Knapsack 0/1", problems: [
            {id: 416001, title: "Partition Equal Subset Sum", difficulty: "Medium", leetcodeNum: 416, points: 30},
            {id: 494001, title: "Target Sum", difficulty: "Medium", leetcodeNum: 494, points: 30},
            {id: 1049001, title: "Last Stone Weight II", difficulty: "Medium", leetcodeNum: 1049, points: 30}
          ]},
          { topic: "Unbounded Knapsack", problems: [
            {id: 518001, title: "Coin Change 2", difficulty: "Medium", leetcodeNum: 518, points: 30},
            {id: 377001, title: "Combination Sum IV", difficulty: "Medium", leetcodeNum: 377, points: 30},
            {id: 983001, title: "Minimum Cost For Tickets", difficulty: "Medium", leetcodeNum: 983, points: 30}
          ]},
          { topic: "DP on Trees", problems: [
            {id: 337001, title: "House Robber III", difficulty: "Medium", leetcodeNum: 337, points: 30},
            {id: 968001, title: "Binary Tree Cameras", difficulty: "Hard", leetcodeNum: 968, points: 35}
          ]},
          { topic: "Matrix Chain Multiplication", problems: [
            {id: 312001, title: "Burst Balloons", difficulty: "Hard", leetcodeNum: 312, points: 40},
            {id: 1039001, title: "Minimum Score Triangulation of Polygon", difficulty: "Medium", leetcodeNum: 1039, points: 30}
          ]},
          { topic: "Week 5 Challenge", problems: [
            {id: 1000001, title: "Minimum Cost to Merge Stones", difficulty: "Hard", leetcodeNum: 1000, points: 40}
          ]}
        ]
      },
      "Week 6": {
        title: "Dynamic Programming - State Machine & Bitmask",
        days: [
          { topic: "State Machine DP", problems: [
            {id: 376001, title: "Wiggle Subsequence", difficulty: "Medium", leetcodeNum: 376, points: 30},
            {id: 801001, title: "Minimum Swaps to Make Sequences Increasing", difficulty: "Hard", leetcodeNum: 801, points: 35},
            {id: 1911001, title: "Maximum Alternating Subsequence Sum", difficulty: "Medium", leetcodeNum: 1911, points: 30}
          ]},
          { topic: "Digit DP", problems: [
            {id: 233001, title: "Number of Digit One", difficulty: "Hard", leetcodeNum: 233, points: 40},
            {id: 902001, title: "Numbers At Most N Given Digit Set", difficulty: "Hard", leetcodeNum: 902, points: 40}
          ]},
          { topic: "Bitmask DP Intro", problems: [
            {id: 526001, title: "Beautiful Arrangement", difficulty: "Medium", leetcodeNum: 526, points: 30},
            {id: 698001, title: "Partition to K Equal Sum Subsets", difficulty: "Medium", leetcodeNum: 698, points: 35}
          ]},
          { topic: "TSP Pattern", problems: [
            {id: 847001, title: "Shortest Path Visiting All Nodes", difficulty: "Hard", leetcodeNum: 847, points: 40},
            {id: 943001, title: "Find the Shortest Superstring", difficulty: "Hard", leetcodeNum: 943, points: 40}
          ]},
          { topic: "DP with Hash", problems: [
            {id: 1066001, title: "Campus Bikes II", difficulty: "Medium", leetcodeNum: 1066, points: 35},
            {id: 1125001, title: "Smallest Sufficient Team", difficulty: "Hard", leetcodeNum: 1125, points: 40}
          ]},
          { topic: "Game Theory DP", problems: [
            {id: 486001, title: "Predict the Winner", difficulty: "Medium", leetcodeNum: 486, points: 30},
            {id: 877001, title: "Stone Game", difficulty: "Medium", leetcodeNum: 877, points: 25}
          ]},
          { topic: "Week 6 DP Mastery", problems: [
            {id: 1478001, title: "Allocate Mailboxes", difficulty: "Hard", leetcodeNum: 1478, points: 40}
          ]}
        ]
      },
      "Week 7": {
        title: "Graph Algorithms - Foundation (DFS & BFS)",
        days: [
          { topic: "Graph Representation & DFS", problems: [
            {id: 797001, title: "All Paths From Source to Target", difficulty: "Medium", leetcodeNum: 797, points: 25},
            {id: 841001, title: "Keys and Rooms", difficulty: "Medium", leetcodeNum: 841, points: 25},
            {id: 133001, title: "Clone Graph", difficulty: "Medium", leetcodeNum: 133, points: 30}
          ]},
          { topic: "Connected Components", problems: [
            {id: 200001, title: "Number of Islands", difficulty: "Medium", leetcodeNum: 200, points: 25},
            {id: 547001, title: "Number of Provinces", difficulty: "Medium", leetcodeNum: 547, points: 25},
            {id: 695001, title: "Max Area of Island", difficulty: "Medium", leetcodeNum: 695, points: 25}
          ]},
          { topic: "Flood Fill", problems: [
            {id: 733001, title: "Flood Fill", difficulty: "Easy", leetcodeNum: 733, points: 20},
            {id: 130001, title: "Surrounded Regions", difficulty: "Medium", leetcodeNum: 130, points: 30},
            {id: 1020001, title: "Number of Enclaves", difficulty: "Medium", leetcodeNum: 1020, points: 30}
          ]},
          { topic: "Multi-source BFS", problems: [
            {id: 542001, title: "01 Matrix", difficulty: "Medium", leetcodeNum: 542, points: 30},
            {id: 994001, title: "Rotting Oranges", difficulty: "Medium", leetcodeNum: 994, points: 25},
            {id: 1162001, title: "As Far from Land as Possible", difficulty: "Medium", leetcodeNum: 1162, points: 30}
          ]},
          { topic: "Cycle Detection", problems: [
            {id: 207001, title: "Course Schedule", difficulty: "Medium", leetcodeNum: 207, points: 30},
            {id: 802001, title: "Find Eventual Safe States", difficulty: "Medium", leetcodeNum: 802, points: 30}
          ]},
          { topic: "Bipartite", problems: [
            {id: 785001, title: "Is Graph Bipartite", difficulty: "Medium", leetcodeNum: 785, points: 30},
            {id: 886001, title: "Possible Bipartition", difficulty: "Medium", leetcodeNum: 886, points: 30}
          ]},
          { topic: "Week 7 Challenge", problems: [
            {id: 1091001, title: "Shortest Path in Binary Matrix", difficulty: "Medium", leetcodeNum: 1091, points: 30},
            {id: 127001, title: "Word Ladder", difficulty: "Hard", leetcodeNum: 127, points: 35}
          ]}
        ]
      },
      "Week 8": {
        title: "Graph Algorithms - Union Find & Topological Sort",
        days: [
          { topic: "Union Find Basics", problems: [
            {id: 684001, title: "Redundant Connection", difficulty: "Medium", leetcodeNum: 684, points: 30},
            {id: 685001, title: "Redundant Connection II", difficulty: "Hard", leetcodeNum: 685, points: 35},
            {id: 323001, title: "Number of Connected Components", difficulty: "Medium", leetcodeNum: 323, points: 25}
          ]},
          { topic: "Union Find with Rank", problems: [
            {id: 721001, title: "Accounts Merge", difficulty: "Medium", leetcodeNum: 721, points: 30},
            {id: 952001, title: "Largest Component Size by Common Factor", difficulty: "Hard", leetcodeNum: 952, points: 40},
            {id: 959001, title: "Regions Cut By Slashes", difficulty: "Medium", leetcodeNum: 959, points: 35}
          ]},
          { topic: "MST - Kruskal", problems: [
            {id: 1584001, title: "Min Cost to Connect All Points", difficulty: "Medium", leetcodeNum: 1584, points: 30},
            {id: 1135001, title: "Connecting Cities With Minimum Cost", difficulty: "Medium", leetcodeNum: 1135, points: 30}
          ]},
          { topic: "Topological Sort", problems: [
            {id: 210001, title: "Course Schedule II", difficulty: "Medium", leetcodeNum: 210, points: 30},
            {id: 269001, title: "Alien Dictionary", difficulty: "Hard", leetcodeNum: 269, points: 40},
            {id: 444001, title: "Sequence Reconstruction", difficulty: "Medium", leetcodeNum: 444, points: 35}
          ]},
          { topic: "Advanced Topo Sort", problems: [
            {id: 1203001, title: "Sort Items by Groups Respecting Dependencies", difficulty: "Hard", leetcodeNum: 1203, points: 40},
            {id: 310001, title: "Minimum Height Trees", difficulty: "Medium", leetcodeNum: 310, points: 30}
          ]},
          { topic: "Graph Coloring", problems: [
            {id: 1042001, title: "Flower Planting With No Adjacent", difficulty: "Medium", leetcodeNum: 1042, points: 25},
            {id: 1129001, title: "Shortest Path with Alternating Colors", difficulty: "Medium", leetcodeNum: 1129, points: 30}
          ]},
          { topic: "Week 8 Challenge", problems: [
            {id: 1319001, title: "Number of Operations to Make Network Connected", difficulty: "Medium", leetcodeNum: 1319, points: 30}
          ]}
        ]
      },
      "Week 9": {
        title: "Graph Algorithms - Shortest Path",
        days: [
          { topic: "Dijkstra Basics", problems: [
            {id: 743001, title: "Network Delay Time", difficulty: "Medium", leetcodeNum: 743, points: 30},
            {id: 1514001, title: "Path with Maximum Probability", difficulty: "Medium", leetcodeNum: 1514, points: 30},
            {id: 787001, title: "Cheapest Flights Within K Stops", difficulty: "Medium", leetcodeNum: 787, points: 35}
          ]},
          { topic: "Modified Dijkstra", problems: [
            {id: 1631001, title: "Path With Minimum Effort", difficulty: "Medium", leetcodeNum: 1631, points: 30},
            {id: 1368001, title: "Minimum Cost to Make at Least One Valid Path", difficulty: "Hard", leetcodeNum: 1368, points: 40},
            {id: 778001, title: "Swim in Rising Water", difficulty: "Hard", leetcodeNum: 778, points: 35}
          ]},
          { topic: "Bellman-Ford", problems: [
            {id: 787002, title: "Cheapest Flights Within K Stops (Bellman)", difficulty: "Medium", leetcodeNum: 787, points: 35},
            {id: 743002, title: "Network Delay Time (Bellman)", difficulty: "Medium", leetcodeNum: 743, points: 30}
          ]},
          { topic: "Floyd-Warshall", problems: [
            {id: 1334001, title: "Find the City With Smallest Number of Neighbors", difficulty: "Medium", leetcodeNum: 1334, points: 30},
            {id: 1462001, title: "Course Schedule IV", difficulty: "Medium", leetcodeNum: 1462, points: 30}
          ]},
          { topic: "A* Search", problems: [
            {id: 1263001, title: "Minimum Moves to Move a Box", difficulty: "Hard", leetcodeNum: 1263, points: 40},
            {id: 773001, title: "Sliding Puzzle", difficulty: "Hard", leetcodeNum: 773, points: 40}
          ]},
          { topic: "Path Reconstruction", problems: [
            {id: 1976001, title: "Number of Ways to Arrive at Destination", difficulty: "Medium", leetcodeNum: 1976, points: 30},
            {id: 2045001, title: "Second Minimum Time to Reach Destination", difficulty: "Hard", leetcodeNum: 2045, points: 40}
          ]},
          { topic: "Week 9 Challenge", problems: [
            {id: 882001, title: "Reachable Nodes In Subdivided Graph", difficulty: "Hard", leetcodeNum: 882, points: 40}
          ]}
        ]
      },
      "Week 10": {
        title: "Graph Algorithms - Advanced Patterns",
        days: [
          { topic: "Strongly Connected", problems: [
            {id: 1192001, title: "Critical Connections in a Network", difficulty: "Hard", leetcodeNum: 1192, points: 40},
            {id: 1568001, title: "Minimum Number of Days to Disconnect Island", difficulty: "Hard", leetcodeNum: 1568, points: 40}
          ]},
          { topic: "Eulerian Path", problems: [
            {id: 332001, title: "Reconstruct Itinerary", difficulty: "Hard", leetcodeNum: 332, points: 35},
            {id: 753001, title: "Cracking the Safe", difficulty: "Hard", leetcodeNum: 753, points: 40}
          ]},
          { topic: "Bipartite Matching", problems: [
            {id: 1947001, title: "Maximum Compatibility Score Sum", difficulty: "Medium", leetcodeNum: 1947, points: 35},
            {id: 1066002, title: "Campus Bikes II (Graph)", difficulty: "Medium", leetcodeNum: 1066, points: 35}
          ]},
          { topic: "Flow Networks", problems: [
            {id: 1820001, title: "Maximum Number of Accepted Invitations", difficulty: "Medium", leetcodeNum: 1820, points: 35},
            {id: 2123001, title: "Minimum Operations to Remove Adjacent Ones", difficulty: "Hard", leetcodeNum: 2123, points: 40}
          ]},
          { topic: "State Space", problems: [
            {id: 864001, title: "Shortest Path to Get All Keys", difficulty: "Hard", leetcodeNum: 864, points: 40},
            {id: 1293001, title: "Shortest Path in Grid with Obstacles Elimination", difficulty: "Hard", leetcodeNum: 1293, points: 40}
          ]},
          { topic: "Graph DP", problems: [
            {id: 1857001, title: "Largest Color Value in a Directed Graph", difficulty: "Hard", leetcodeNum: 1857, points: 40},
            {id: 2050001, title: "Parallel Courses III", difficulty: "Hard", leetcodeNum: 2050, points: 35}
          ]},
          { topic: "Week 10 Mastery", problems: [
            {id: 2577001, title: "Minimum Time to Visit a Cell in a Grid", difficulty: "Hard", leetcodeNum: 2577, points: 40}
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
        title: "Hard DP Patterns - Interval & Game Theory",
        days: [
          { topic: "Interval DP", problems: [
            {id: 87001, title: "Scramble String", difficulty: "Hard", leetcodeNum: 87, points: 50},
            {id: 1547001, title: "Minimum Cost to Cut a Stick", difficulty: "Hard", leetcodeNum: 1547, points: 50},
            {id: 1000002, title: "Minimum Cost to Merge Stones", difficulty: "Hard", leetcodeNum: 1000, points: 50}
          ]},
          { topic: "Game Theory DP", problems: [
            {id: 292001, title: "Nim Game", difficulty: "Easy", leetcodeNum: 292, points: 20},
            {id: 464001, title: "Can I Win", difficulty: "Medium", leetcodeNum: 464, points: 40},
            {id: 1140001, title: "Stone Game II", difficulty: "Medium", leetcodeNum: 1140, points: 45},
            {id: 1510001, title: "Stone Game IV", difficulty: "Hard", leetcodeNum: 1510, points: 50}
          ]},
          { topic: "Minimax DP", problems: [
            {id: 375001, title: "Guess Number Higher or Lower II", difficulty: "Medium", leetcodeNum: 375, points: 40},
            {id: 1406001, title: "Stone Game III", difficulty: "Hard", leetcodeNum: 1406, points: 50},
            {id: 1563001, title: "Stone Game V", difficulty: "Hard", leetcodeNum: 1563, points: 50}
          ]},
          { topic: "DP on Strings", problems: [
            {id: 1216001, title: "Valid Palindrome III", difficulty: "Hard", leetcodeNum: 1216, points: 45},
            {id: 1000003, title: "Minimum Cost to Merge Stones", difficulty: "Hard", leetcodeNum: 1000, points: 50}
          ]},
          { topic: "Probability DP", problems: [
            {id: 837001, title: "New 21 Game", difficulty: "Medium", leetcodeNum: 837, points: 45},
            {id: 688001, title: "Knight Probability in Chessboard", difficulty: "Medium", leetcodeNum: 688, points: 40}
          ]},
          { topic: "Hard State DP", problems: [
            {id: 1411001, title: "Number of Ways to Paint N × 3 Grid", difficulty: "Hard", leetcodeNum: 1411, points: 50},
            {id: 1359001, title: "Count All Valid Pickup Delivery Options", difficulty: "Hard", leetcodeNum: 1359, points: 50}
          ]},
          { topic: "Week 1 Boss", problems: [
            {id: 920001, title: "Number of Music Playlists", difficulty: "Hard", leetcodeNum: 920, points: 50}
          ]}
        ]
      },
      "Week 2": {
        title: "Hard Graph & Tree Problems",
        days: [
          { topic: "Advanced Tree DP", problems: [
            {id: 1569001, title: "Number of Ways to Reorder Array", difficulty: "Hard", leetcodeNum: 1569, points: 50},
            {id: 1617001, title: "Count Subtrees With Max Distance", difficulty: "Hard", leetcodeNum: 1617, points: 50}
          ]},
          { topic: "Tree Construction", problems: [
            {id: 1719001, title: "Number Of Ways To Reconstruct Tree", difficulty: "Hard", leetcodeNum: 1719, points: 50},
            {id: 1028001, title: "Recover Tree From Preorder Traversal", difficulty: "Hard", leetcodeNum: 1028, points: 45}
          ]},
          { topic: "Graph Matching", problems: [
            {id: 1349001, title: "Maximum Students Taking Exam", difficulty: "Hard", leetcodeNum: 1349, points: 50},
            {id: 1595001, title: "Minimum Cost to Connect Two Groups", difficulty: "Hard", leetcodeNum: 1595, points: 50}
          ]},
          { topic: "Advanced Shortest Path", problems: [
            {id: 1728001, title: "Cat and Mouse II", difficulty: "Hard", leetcodeNum: 1728, points: 55},
            {id: 815001, title: "Bus Routes", difficulty: "Hard", leetcodeNum: 815, points: 45}
          ]},
          { topic: "Graph Theory", problems: [
            {id: 765001, title: "Couples Holding Hands", difficulty: "Hard", leetcodeNum: 765, points: 50},
            {id: 1632001, title: "Rank Transform of a Matrix", difficulty: "Hard", leetcodeNum: 1632, points: 50}
          ]},
          { topic: "Advanced DFS/BFS", problems: [
            {id: 1298001, title: "Maximum Candies You Can Get from Boxes", difficulty: "Hard", leetcodeNum: 1298, points: 45},
            {id: 854001, title: "K-Similar Strings", difficulty: "Hard", leetcodeNum: 854, points: 50}
          ]},
          { topic: "Week 2 Boss", problems: [
            {id: 1036001, title: "Escape a Large Maze", difficulty: "Hard", leetcodeNum: 1036, points: 50}
          ]}
        ]
      },
      "Week 3": {
        title: "Advanced Data Structures",
        days: [
          { topic: "Trie Advanced", problems: [
            {id: 212001, title: "Word Search II", difficulty: "Hard", leetcodeNum: 212, points: 45},
            {id: 472001, title: "Concatenated Words", difficulty: "Hard", leetcodeNum: 472, points: 50},
            {id: 1707001, title: "Maximum XOR With Element From Array", difficulty: "Hard", leetcodeNum: 1707, points: 50}
          ]},
          { topic: "Segment Tree", problems: [
            {id: 307001, title: "Range Sum Query Mutable", difficulty: "Medium", leetcodeNum: 307, points: 40},
            {id: 315001, title: "Count of Smaller Numbers After Self", difficulty: "Hard", leetcodeNum: 315, points: 50},
            {id: 327001, title: "Count of Range Sum", difficulty: "Hard", leetcodeNum: 327, points: 55}
          ]},
          { topic: "Fenwick Tree", problems: [
            {id: 493001, title: "Reverse Pairs", difficulty: "Hard", leetcodeNum: 493, points: 50},
            {id: 1649001, title: "Create Sorted Array through Instructions", difficulty: "Hard", leetcodeNum: 1649, points: 50}
          ]},
          { topic: "Monotonic Queue/Stack", problems: [
            {id: 1499001, title: "Max Value of Equation", difficulty: "Hard", leetcodeNum: 1499, points: 45},
            {id: 1425001, title: "Constrained Subsequence Sum", difficulty: "Hard", leetcodeNum: 1425, points: 50}
          ]},
          { topic: "Advanced Heap", problems: [
            {id: 295001, title: "Find Median from Data Stream", difficulty: "Hard", leetcodeNum: 295, points: 45},
            {id: 502001, title: "IPO", difficulty: "Hard", leetcodeNum: 502, points: 50},
            {id: 1606001, title: "Find Servers That Handled Most Requests", difficulty: "Hard", leetcodeNum: 1606, points: 50}
          ]},
          { topic: "LRU/LFU", problems: [
            {id: 146001, title: "LRU Cache", difficulty: "Medium", leetcodeNum: 146, points: 40},
            {id: 460001, title: "LFU Cache", difficulty: "Hard", leetcodeNum: 460, points: 50}
          ]},
          { topic: "Week 3 Boss", problems: [
            {id: 432001, title: "All O one Data Structure", difficulty: "Hard", leetcodeNum: 432, points: 55}
          ]}
        ]
      },
      "Week 4": {
        title: "String Algorithms & Pattern Matching",
        days: [
          { topic: "KMP Algorithm", problems: [
            {id: 28001, title: "Implement strStr", difficulty: "Easy", leetcodeNum: 28, points: 20},
            {id: 214001, title: "Shortest Palindrome", difficulty: "Hard", leetcodeNum: 214, points: 50},
            {id: 686001, title: "Repeated String Match", difficulty: "Medium", leetcodeNum: 686, points: 35}
          ]},
          { topic: "Rabin-Karp", problems: [
            {id: 1044001, title: "Longest Duplicate Substring", difficulty: "Hard", leetcodeNum: 1044, points: 55},
            {id: 187001, title: "Repeated DNA Sequences", difficulty: "Medium", leetcodeNum: 187, points: 35}
          ]},
          { topic: "Manacher's Algorithm", problems: [
            {id: 5001, title: "Longest Palindromic Substring", difficulty: "Medium", leetcodeNum: 5, points: 35},
            {id: 647002, title: "Palindromic Substrings", difficulty: "Medium", leetcodeNum: 647, points: 35}
          ]},
          { topic: "Suffix Array", problems: [
            {id: 1044002, title: "Longest Duplicate Substring (SA)", difficulty: "Hard", leetcodeNum: 1044, points: 55},
            {id: 1713001, title: "Minimum Operations to Make Subsequence", difficulty: "Hard", leetcodeNum: 1713, points: 50}
          ]},
          { topic: "String Hashing", problems: [
            {id: 1923001, title: "Longest Common Subpath", difficulty: "Hard", leetcodeNum: 1923, points: 55},
            {id: 1392001, title: "Longest Happy Prefix", difficulty: "Hard", leetcodeNum: 1392, points: 50}
          ]},
          { topic: "Automaton", problems: [
            {id: 65001, title: "Valid Number", difficulty: "Hard", leetcodeNum: 65, points: 45},
            {id: 8001, title: "String to Integer atoi", difficulty: "Medium", leetcodeNum: 8, points: 30}
          ]},
          { topic: "Week 4 Boss", problems: [
            {id: 336001, title: "Palindrome Pairs", difficulty: "Hard", leetcodeNum: 336, points: 55}
          ]}
        ]
      },
      "Week 5": {
        title: "Advanced Math & Combinatorics",
        days: [
          { topic: "Number Theory", problems: [
            {id: 172001, title: "Factorial Trailing Zeroes", difficulty: "Medium", leetcodeNum: 172, points: 30},
            {id: 793001, title: "Preimage Size of Factorial Zeroes", difficulty: "Hard", leetcodeNum: 793, points: 50},
            {id: 1012001, title: "Numbers With Repeated Digits", difficulty: "Hard", leetcodeNum: 1012, points: 50}
          ]},
          { topic: "Combinatorics", problems: [
            {id: 60001, title: "Permutation Sequence", difficulty: "Hard", leetcodeNum: 60, points: 45},
            {id: 1830001, title: "Minimum Operations to Make String Sorted", difficulty: "Hard", leetcodeNum: 1830, points: 55},
            {id: 1735001, title: "Count Ways to Make Array With Product", difficulty: "Hard", leetcodeNum: 1735, points: 55}
          ]},
          { topic: "Matrix Operations", problems: [
            {id: 311001, title: "Sparse Matrix Multiplication", difficulty: "Medium", leetcodeNum: 311, points: 35},
            {id: 1392002, title: "Longest Happy Prefix", difficulty: "Hard", leetcodeNum: 1392, points: 50}
          ]},
          { topic: "Fast Power", problems: [
            {id: 50001, title: "Pow x n", difficulty: "Medium", leetcodeNum: 50, points: 30},
            {id: 1922001, title: "Count Good Numbers", difficulty: "Medium", leetcodeNum: 1922, points: 40},
            {id: 372001, title: "Super Pow", difficulty: "Medium", leetcodeNum: 372, points: 40}
          ]},
          { topic: "Bit Manipulation", problems: [
            {id: 1542001, title: "Find Longest Awesome Substring", difficulty: "Hard", leetcodeNum: 1542, points: 55},
            {id: 1659001, title: "Maximize Grid Happiness", difficulty: "Hard", leetcodeNum: 1659, points: 55}
          ]},
          { topic: "Game Theory", problems: [
            {id: 913001, title: "Cat and Mouse", difficulty: "Hard", leetcodeNum: 913, points: 55},
            {id: 294001, title: "Flip Game II", difficulty: "Medium", leetcodeNum: 294, points: 40}
          ]},
          { topic: "Week 5 Boss", problems: [
            {id: 891001, title: "Sum of Subsequence Widths", difficulty: "Hard", leetcodeNum: 891, points: 55}
          ]}
        ]
      },
      "Week 6": {
        title: "Geometry & Advanced Search",
        days: [
          { topic: "Computational Geometry", problems: [
            {id: 587001, title: "Erect the Fence", difficulty: "Hard", leetcodeNum: 587, points: 50},
            {id: 149001, title: "Max Points on a Line", difficulty: "Hard", leetcodeNum: 149, points: 45},
            {id: 963001, title: "Minimum Area Rectangle II", difficulty: "Medium", leetcodeNum: 963, points: 40}
          ]},
          { topic: "Line Sweep", problems: [
            {id: 218001, title: "The Skyline Problem", difficulty: "Hard", leetcodeNum: 218, points: 55},
            {id: 850001, title: "Rectangle Area II", difficulty: "Hard", leetcodeNum: 850, points: 50},
            {id: 391001, title: "Perfect Rectangle", difficulty: "Hard", leetcodeNum: 391, points: 50}
          ]},
          { topic: "Divide and Conquer", problems: [
            {id: 493002, title: "Reverse Pairs", difficulty: "Hard", leetcodeNum: 493, points: 50},
            {id: 4001, title: "Median of Two Sorted Arrays", difficulty: "Hard", leetcodeNum: 4, points: 50},
            {id: 23001, title: "Merge k Sorted Lists", difficulty: "Hard", leetcodeNum: 23, points: 45}
          ]},
          { topic: "Backtracking Optimization", problems: [
            {id: 51001, title: "N-Queens", difficulty: "Hard", leetcodeNum: 51, points: 45},
            {id: 52001, title: "N-Queens II", difficulty: "Hard", leetcodeNum: 52, points: 45},
            {id: 37001, title: "Sudoku Solver", difficulty: "Hard", leetcodeNum: 37, points: 50}
          ]},
          { topic: "Meet in the Middle", problems: [
            {id: 1755001, title: "Closest Subsequence Sum", difficulty: "Hard", leetcodeNum: 1755, points: 55},
            {id: 1425002, title: "Constrained Subsequence Sum", difficulty: "Hard", leetcodeNum: 1425, points: 50}
          ]},
          { topic: "Randomized Algorithms", problems: [
            {id: 478001, title: "Generate Random Point in a Circle", difficulty: "Medium", leetcodeNum: 478, points: 35},
            {id: 519001, title: "Random Flip Matrix", difficulty: "Medium", leetcodeNum: 519, points: 40}
          ]},
          { topic: "Week 6 Boss", problems: [
            {id: 335001, title: "Self Crossing", difficulty: "Hard", leetcodeNum: 335, points: 60}
          ]}
        ]
      },
      "Week 7": {
        title: "System Design & Special Problems",
        days: [
          { topic: "Design Problems", problems: [
            {id: 432002, title: "All O one Data Structure", difficulty: "Hard", leetcodeNum: 432, points: 55},
            {id: 1622001, title: "Fancy Sequence", difficulty: "Hard", leetcodeNum: 1622, points: 55},
            {id: 588001, title: "Design In-Memory File System", difficulty: "Hard", leetcodeNum: 588, points: 50}
          ]},
          { topic: "Simulation", problems: [
            {id: 289001, title: "Game of Life", difficulty: "Medium", leetcodeNum: 289, points: 30},
            {id: 1223001, title: "Dice Roll Simulation", difficulty: "Hard", leetcodeNum: 1223, points: 50},
            {id: 818001, title: "Race Car", difficulty: "Hard", leetcodeNum: 818, points: 55}
          ]},
          { topic: "Expression Evaluation", problems: [
            {id: 770001, title: "Basic Calculator IV", difficulty: "Hard", leetcodeNum: 770, points: 55},
            {id: 736001, title: "Parse Lisp Expression", difficulty: "Hard", leetcodeNum: 736, points: 50}
          ]},
          { topic: "Hard Greedy", problems: [
            {id: 321001, title: "Create Maximum Number", difficulty: "Hard", leetcodeNum: 321, points: 55},
            {id: 1505001, title: "Minimum Possible Integer After K Swaps", difficulty: "Hard", leetcodeNum: 1505, points: 55}
          ]},
          { topic: "Multi-threading", problems: [
            {id: 1188001, title: "Design Bounded Blocking Queue", difficulty: "Medium", leetcodeNum: 1188, points: 40},
            {id: 1242001, title: "Web Crawler Multithreaded", difficulty: "Medium", leetcodeNum: 1242, points: 45}
          ]},
          { topic: "Brain Teasers", problems: [
            {id: 319001, title: "Bulb Switcher", difficulty: "Medium", leetcodeNum: 319, points: 30},
            {id: 858001, title: "Mirror Reflection", difficulty: "Medium", leetcodeNum: 858, points: 40}
          ]},
          { topic: "Week 7 Ultimate", problems: [
            {id: 727001, title: "Minimum Window Subsequence", difficulty: "Hard", leetcodeNum: 727, points: 55}
          ]}
        ]
      },
      "Week 8": {
        title: "Grand Finale - Mixed Mastery",
        days: [
          { topic: "Legendary Problems Set 1", problems: [
            {id: 297002, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", leetcodeNum: 297, points: 50},
            {id: 124002, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", leetcodeNum: 124, points: 50},
            {id: 1671001, title: "Minimum Number of Removals to Make Mountain", difficulty: "Hard", leetcodeNum: 1671, points: 55}
          ]},
          { topic: "Legendary Problems Set 2", problems: [
            {id: 403001, title: "Frog Jump", difficulty: "Hard", leetcodeNum: 403, points: 50},
            {id: 1187001, title: "Make Array Strictly Increasing", difficulty: "Hard", leetcodeNum: 1187, points: 55}
          ]},
          { topic: "Legendary Problems Set 3", problems: [
            {id: 780001, title: "Reaching Points", difficulty: "Hard", leetcodeNum: 780, points: 55},
            {id: 1359002, title: "Count All Valid Pickup and Delivery", difficulty: "Hard", leetcodeNum: 1359, points: 55}
          ]},
          { topic: "Legendary Problems Set 4", problems: [
            {id: 995001, title: "Minimum Number of K Consecutive Bit Flips", difficulty: "Hard", leetcodeNum: 995, points: 55},
            {id: 1499002, title: "Max Value of Equation", difficulty: "Hard", leetcodeNum: 1499, points: 50}
          ]},
          { topic: "Legendary Problems Set 5", problems: [
            {id: 862001, title: "Shortest Subarray with Sum at Least K", difficulty: "Hard", leetcodeNum: 862, points: 55},
            {id: 1675001, title: "Minimize Deviation in Array", difficulty: "Hard", leetcodeNum: 1675, points: 55}
          ]},
          { topic: "Legendary Problems Set 6", problems: [
            {id: 1872001, title: "Stone Game VIII", difficulty: "Hard", leetcodeNum: 1872, points: 60},
            {id: 899001, title: "Orderly Queue", difficulty: "Hard", leetcodeNum: 899, points: 55}
          ]},
          { topic: "The Final Boss", problems: [
            {id: 25001, title: "Reverse Nodes in k-Group", difficulty: "Hard", leetcodeNum: 25, points: 50},
            {id: 629001, title: "K Inverse Pairs Array", difficulty: "Hard", leetcodeNum: 629, points: 60},
            {id: 1944001, title: "Number of Visible People in a Queue", difficulty: "Hard", leetcodeNum: 1944, points: 55}
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