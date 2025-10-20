// "use client";
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Users, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
// import { useAuth } from '@/lib/providers/AuthProvider';
// import { joinTeamByCode, getTeamByJoinCode } from '@/lib/services/teamSheetService';
// import { sendMemberJoined } from '@/lib/services/notificationService';

// export default function JoinTeamByCode({ onSuccess }: { onSuccess?: () => void }) {
//   const { user } = useAuth();
//   const [joinCode, setJoinCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [previewTeam, setPreviewTeam] = useState<any>(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handlePreview = async () => {
//     if (!joinCode.trim()) return;

//     setLoading(true);
//     setError('');
//     setPreviewTeam(null);

//     try {
//       const team = await getTeamByJoinCode(joinCode.trim().toUpperCase());
//       setPreviewTeam(team);
//     } catch (err: any) {
//       setError(err.message || 'Invalid join code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !previewTeam) {
//       handlePreview();
//     }
//   };

//   if (success) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="text-center p-8"
//       >
//         <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//           <CheckCircle className="w-10 h-10 text-green-500" />
//         </div>
//         <h3 className="text-2xl font-bold text-white mb-2">Welcome to the team! 🎉</h3>
//         <p className="text-gray-400">Redirecting you to your team...</p>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-black rounded-lg border border-cyan-500/30 p-6"
//       >
//         <div className="text-center mb-6">
//           <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Users className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">Join a Team</h2>
//           <p className="text-gray-400">Enter the team code to join</p>
//         </div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
//           >
//             {error}
//           </motion.div>
//         )}

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Team Code
//             </label>
//             <input
//               type="text"
//               value={joinCode}
//               onChange={(e) => {
//                 setJoinCode(e.target.value.toUpperCase());
//                 setPreviewTeam(null);
//                 setError('');
//               }}
//               onKeyPress={handleKeyPress}
//               placeholder="XXXXXXXX"
//               maxLength={8}
//               className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl font-bold tracking-widest placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
//             />
//           </div>

//           {!previewTeam ? (
//             <button
//               onClick={handlePreview}
//               disabled={loading || joinCode.length < 6}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Checking...
//                 </>
//               ) : (
//                 <>
//                   Preview Team
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           ) : (
//             <>
//               {/* Team Preview */}
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg"
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
//                     <Users className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-white">{previewTeam.team_name}</h3>
//                     <p className="text-sm text-gray-400">{previewTeam.description}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-3 border-t border-cyan-500/30">
//                   <div className="text-sm">
//                     <span className="text-gray-400">Members:</span>
//                     <span className="text-white font-medium ml-2">{previewTeam.member_count || 0}</span>
//                   </div>
//                   <div className="text-sm">
//                     <span className="text-gray-400">Total Points:</span>
//                     <span className="text-cyan-400 font-medium ml-2">{previewTeam.total_points || 0}</span>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Join Button */}
//               <button
//                 onClick={handleJoin}
//                 disabled={loading}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 rounded-lg text-white font-medium transition-all"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Joining...
//                   </>
//                 ) : (
//                   <>
//                     Join Team
//                     <CheckCircle className="w-5 h-5" />
//                   </>
//                 )}
//               </button>

//               <button
//                 onClick={() => {
//                   setPreviewTeam(null);
//                   setJoinCode('');
//                 }}
//                 className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
//               >
//                 Try Different Code
//               </button>
//             </>
//           )}
//         </div>

//         <div className="mt-6 pt-6 border-t border-gray-800">
//           <p className="text-xs text-gray-500 text-center">
//             💡 Team codes are 8 characters long and case-insensitive
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
      
//       setSuccess(true);
//       setTimeout(() => {
//         if (onSuccess) onSuccess();
//       }, 2000);
//     } catch (err: any) {
//       setError(err.message || 'Failed to join team');
//     } finally {
//       setLoading(false);
//     }
//   };
// }