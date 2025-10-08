// // app/(dashboard)/profile/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/app/providers';
// import { createClient } from '@/lib/supabase/client';
// import { motion } from 'framer-motion';
// import {
//   Code2, Trophy, Medal, Flame, Users, Zap,
//   ExternalLink, TrendingUp, Award, Star, Activity
// } from 'lucide-react';
// import { getAvatarComponent, avatarIcons } from '@/lib/config/avatar';

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const supabase = createClient();

//   const [userStats, setUserStats] = useState<any>(null);
//   const [leetcodeUsername, setLeetcodeUsername] = useState('');
//   const [leetcodeStats, setLeetcodeStats] = useState<any>(null);
//   const [isLoadingLeetcode, setIsLoadingLeetcode] = useState(false);
//   const [showAvatarPicker, setShowAvatarPicker] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState('user');
//   const [leaderboardRank, setLeaderboardRank] = useState(0);

//   useEffect(() => {
//     if (user) {
//       loadProfile();
//     }
//   }, [user]);

//   const loadProfile = async () => {
//     if (!user) return;

//     const { data } = await supabase
//       .from('user_stats')
//       .select('*')
//       .eq('user_id', user.id)
//       .single();

//     if (data) {
//       setUserStats(data);
//       setLeetcodeUsername(data.leetcode_username || '');
//       setLeetcodeStats(data.leetcode_stats);
//       setSelectedAvatar(data.avatar || 'user');
//     }

//     // Get rank
//     const { data: allUsers } = await supabase
//       .from('user_stats')
//       .select('user_id, points')
//       .order('points', { ascending: false });

//     if (allUsers) {
//       const rank = allUsers.findIndex(u => u.user_id === user.id) + 1;
//       setLeaderboardRank(rank);
//     }
//   };

//   const calculateStreak = (submissionCalendar: any) => {
//     if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) return 0;

//     const dates = new Set();
//     Object.keys(submissionCalendar).forEach(timestamp => {
//       const date = new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0];
//       dates.add(date);
//     });

//     const sortedDates = Array.from(dates).sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());
//     if (sortedDates.length === 0) return 0;

//     const today = new Date().toISOString().split('T')[0];
//     const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

//     if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

//     let streak = 1;
//     let currentDate = new Date(sortedDates[0] as string);

//     for (let i = 1; i < sortedDates.length; i++) {
//       const prevDate = new Date(sortedDates[i] as string);
//       const expectedDate = new Date(currentDate);
//       expectedDate.setDate(expectedDate.getDate() - 1);

//       if (prevDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
//         streak++;
//         currentDate = prevDate;
//       } else {
//         break;
//       }
//     }

//     return streak;
//   };

//   const fetchLeetcodeStats = async () => {
//     if (!leetcodeUsername.trim()) {
//       alert('Please enter a username');
//       return;
//     }

//     setIsLoadingLeetcode(true);

//     try {
//       const [userInfoRes, userProfileRes, calendarRes] = await Promise.all([
//         fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}`),
//         fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/solved`),
//         fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/calendar`)
//       ]);

//       if (!userInfoRes.ok || !userProfileRes.ok || !calendarRes.ok) {
//         throw new Error('User not found');
//       }

//       const [userInfo, userProfile, calendar] = await Promise.all([
//         userInfoRes.json(),
//         userProfileRes.json(),
//         calendarRes.json()
//       ]);

//       const currentStreak = calculateStreak(calendar.submissionCalendar);

//       const leetcodeData = {
//         username: leetcodeUsername,
//         realName: userInfo.name || leetcodeUsername,
//         ranking: userInfo.ranking || 0,
//         reputation: userInfo.reputation || 0,
//         solved: {
//           easy: userProfile.easySolved || 0,
//           medium: userProfile.mediumSolved || 0,
//           hard: userProfile.hardSolved || 0,
//           all: userProfile.solvedProblem || 0
//         },
//         submissions: {
//           all: userProfile.totalSubmissionNum?.[0]?.count || 0
//         },
//         calendar: {
//           streak: currentStreak,
//           totalActiveDays: Object.keys(calendar.submissionCalendar || {}).length,
//           submissionCalendar: calendar.submissionCalendar || {}
//         },
//         contestRanking: {
//           attendedContestsCount: userInfo.contestAttend || 0,
//           rating: Math.round(userInfo.contestRating || 0),
//           globalRanking: userInfo.contestGlobalRanking || 0,
//           topPercentage: userInfo.contestTopPercentage?.toFixed(2) || '0.00'
//         },
//         badges: userInfo.badges?.map((b: any) => ({
//           displayName: b.displayName || b.name,
//           icon: '🏆'
//         })) || [],
//         recentSubmissions: userInfo.recentSubmissions?.slice(0, 10) || [],
//         lastUpdated: new Date().toISOString()
//       };

//       setLeetcodeStats(leetcodeData);

//       await supabase
//         .from('user_stats')
//         .update({
//           leetcode_username: leetcodeUsername,
//           leetcode_stats: leetcodeData
//         })
//         .eq('user_id', user!.id);

//     } catch (error) {
//       alert('Failed to fetch LeetCode profile. Please check the username.');
//     } finally {
//       setIsLoadingLeetcode(false);
//     }
//   };

//   const updateAvatar = async (avatarId: string) => {
//     setSelectedAvatar(avatarId);
//     await supabase
//       .from('user_stats')
//       .update({ avatar: avatarId })
//       .eq('user_id', user!.id);
//     setShowAvatarPicker(false);
//   };

//   const { IconComponent: CurrentIcon, color: currentColor } = getAvatarComponent(selectedAvatar);

//   if (!userStats) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
//       {/* Profile Header */}
//       <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30 p-8">
//         <div className="flex items-center gap-6">
//           <div
//             onClick={() => setShowAvatarPicker(true)}
//             className={`w-28 h-28 rounded-full bg-gradient-to-br ${currentColor} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ring-4 ring-blue-500`}
//           >
//             <CurrentIcon className="w-14 h-14 text-white" />
//           </div>
          
//           <div className="flex-1">
//             <h1 className="text-3xl font-bold mb-2">{user?.user_metadata?.full_name}</h1>
//             <p className="text-gray-400 mb-4">{user?.email}</p>
            
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-lg">
//                 <Trophy className="w-5 h-5 text-yellow-400" />
//                 <span className="font-bold">{userStats.points} points</span>
//               </div>
//               <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-lg">
//                 <Medal className="w-5 h-5 text-purple-400" />
//                 <span className="font-bold">Rank #{leaderboardRank}</span>
//               </div>
//               <div className="flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-lg">
//                 <Flame className="w-5 h-5 text-orange-400" />
//                 <span className="font-bold">{userStats.streak} day streak</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Avatar Picker */}
//       {showAvatarPicker && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={() => setShowAvatarPicker(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full"
//           >
//             <h3 className="text-xl font-bold mb-4">Choose Your Avatar</h3>
//             <div className="grid grid-cols-4 gap-3">
//               {avatarIcons.map(avatar => {
//                 const Icon = avatar.icon;
//                 return (
//                   <button
//                     key={avatar.id}
//                     onClick={() => updateAvatar(avatar.id)}
//                     className={`aspect-square rounded-xl bg-gradient-to-br ${avatar.color} flex items-center justify-center hover:scale-110 transition-transform ${
//                       selectedAvatar === avatar.id ? 'ring-4 ring-white' : ''
//                     }`}
//                   >
//                     <Icon className="w-8 h-8 text-white" />
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* LeetCode Integration */}
//       <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl border border-orange-500/30 p-6">
//         <div className="flex items-center gap-3 mb-6">
//           <Code2 className="w-8 h-8 text-orange-400" />
//           <div>
//             <h2 className="text-2xl font-bold">LeetCode Integration</h2>
//             <p className="text-gray-400">Sync your LeetCode profile for detailed analytics</p>
//           </div>
//         </div>

//         <div className="flex gap-3 mb-6">
//           <input
//             type="text"
//             value={leetcodeUsername}
//             onChange={(e) => setLeetcodeUsername(e.target.value)}
//             placeholder="Enter your LeetCode username"
//             className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
//           />
//           <button
//             onClick={fetchLeetcodeStats}
//             disabled={isLoadingLeetcode}
//             className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
//           >
//             {isLoadingLeetcode ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
//                 Loading...
//               </>
//             ) : (
//               <>
//                 <Zap className="w-5 h-5" />
//                 Sync
//               </>
//             )}
//           </button>
//         </div>

//         {leetcodeStats && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-6"
//           >
//             {/* Stats Cards */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
//                 <p className="text-sm text-gray-400">Easy</p>
//                 <p className="text-3xl font-bold text-green-400">{leetcodeStats.solved.easy}</p>
//               </div>
//               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
//                 <p className="text-sm text-gray-400">Medium</p>
//                 <p className="text-3xl font-bold text-yellow-400">{leetcodeStats.solved.medium}</p>
//               </div>
//               <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
//                 <p className="text-sm text-gray-400">Hard</p>
//                 <p className="text-3xl font-bold text-red-400">{leetcodeStats.solved.hard}</p>
//               </div>
//               <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
//                 <p className="text-sm text-gray-400">Total</p>
//                 <p className="text-3xl font-bold text-purple-400">{leetcodeStats.solved.all}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
//                 <div className="flex items-center gap-2 mb-3">
//                   <TrendingUp className="w-5 h-5 text-blue-400" />
//                   <h3 className="font-bold">Ranking</h3>
//                 </div>
//                 <p className="text-3xl font-bold text-blue-400">#{leetcodeStats.ranking?.toLocaleString()}</p>
//                 <p className="text-sm text-gray-400 mt-1">{leetcodeStats.reputation} reputation</p>
//               </div>

//               <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Flame className="w-5 h-5 text-orange-400" />
//                   <h3 className="font-bold">Activity</h3>
//                 </div>
//                 <p className="text-3xl font-bold text-orange-400">{leetcodeStats.calendar.streak}</p>
//                 <p className="text-sm text-gray-400 mt-1">{leetcodeStats.calendar.totalActiveDays} total days</p>
//               </div>
//             </div>

//               <a
//                 href={`https://leetcode.com/${leetcodeUsername}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-bold transition-colors"
//               >
//                 <ExternalLink className="w-5 h-5" />
//                 View Full Profile on LeetCode
//               </a>
//               </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }