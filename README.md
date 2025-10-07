This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


codequest/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                         # Main Dashboard
│   │   ├── problems/
│   │   │   ├── page.tsx                     # Problems list with filters
│   │   │   ├── [problemId]/
│   │   │   │   └── page.tsx                 # Individual problem detail
│   │   │   ├── notes/
│   │   │   │   └── page.tsx                 # Problem notes management
│   │   │   └── favorites/
│   │   │       └── page.tsx                 # Favorited problems
│   │   ├── leaderboard/
│   │   │   ├── page.tsx                     # Global leaderboard
│   │   │   ├── weekly/
│   │   │   │   └── page.tsx                 # Weekly leaderboard
│   │   │   ├── monthly/
│   │   │   │   └── page.tsx                 # Monthly leaderboard
│   │   │   └── friends/
│   │   │       └── page.tsx                 # Friends leaderboard
│   │   ├── teams/
│   │   │   ├── page.tsx                     # Teams list & join
│   │   │   ├── create/
│   │   │   │   └── page.tsx                 # Create team form
│   │   │   ├── [teamId]/
│   │   │   │   ├── page.tsx                 # Team details & dashboard
│   │   │   │   ├── members/
│   │   │   │   │   └── page.tsx             # Team members management
│   │   │   │   ├── leaderboard/
│   │   │   │   │   └── page.tsx             # Team internal leaderboard
│   │   │   │   ├── challenges/
│   │   │   │   │   └── page.tsx             # Team challenges
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx             # Team settings (admin only)
│   │   │   ├── invitations/
│   │   │   │   └── page.tsx                 # Pending team invitations
│   │   │   └── search/
│   │   │       └── page.tsx                 # Search & discover teams
│   │   ├── profile/
│   │   │   ├── page.tsx                     # User profile view
│   │   │   ├── [userId]/
│   │   │   │   └── page.tsx                 # Other user's profile
│   │   │   ├── edit/
│   │   │   │   └── page.tsx                 # Edit profile
│   │   │   ├── settings/
│   │   │   │   └── page.tsx                 # Account settings
│   │   │   ├── stats/
│   │   │   │   └── page.tsx                 # Detailed statistics
│   │   │   └── history/
│   │   │       └── page.tsx                 # Submission history
│   │   ├── battles/
│   │   │   ├── page.tsx                     # Battles list & lobby
│   │   │   ├── create/
│   │   │   │   └── page.tsx                 # Create battle
│   │   │   ├── [battleId]/
│   │   │   │   ├── page.tsx                 # Battle room (real-time)
│   │   │   │   ├── lobby/
│   │   │   │   │   └── page.tsx             # Pre-battle lobby
│   │   │   │   └── results/
│   │   │   │       └── page.tsx             # Battle results & replay
│   │   │   ├── history/
│   │   │   │   └── page.tsx                 # Past battles history
│   │   │   └── tournaments/
│   │   │       ├── page.tsx                 # Tournaments list
│   │   │       ├── create/
│   │   │       │   └── page.tsx             # Create tournament
│   │   │       └── [tournamentId]/
│   │   │           ├── page.tsx             # Tournament details
│   │   │           └── bracket/
│   │   │               └── page.tsx         # Tournament bracket view
│   │   ├── achievements/
│   │   │   ├── page.tsx                     # All achievements
│   │   │   ├── [achievementId]/
│   │   │   │   └── page.tsx                 # Achievement detail
│   │   │   ├── milestones/
│   │   │   │   └── page.tsx                 # Milestone achievements
│   │   │   └── showcase/
│   │   │       └── page.tsx                 # Achievement showcase
│   │   ├── revision/
│   │   │   ├── page.tsx                     # Revision dashboard
│   │   │   ├── schedule/
│   │   │   │   └── page.tsx                 # Spaced repetition schedule
│   │   │   ├── sessions/
│   │   │   │   ├── page.tsx                 # Revision sessions list
│   │   │   │   └── [sessionId]/
│   │   │   │       └── page.tsx             # Active revision session
│   │   │   └── notes/
│   │   │       └── page.tsx                 # Consolidated notes
│   │   ├── analytics/
│   │   │   ├── page.tsx                     # Main analytics dashboard
│   │   │   ├── insights/
│   │   │   │   └── page.tsx                 # AI-powered insights
│   │   │   ├── patterns/
│   │   │   │   └── page.tsx                 # Problem-solving patterns
│   │   │   ├── time-tracking/
│   │   │   │   └── page.tsx                 # Time spent analytics
│   │   │   ├── heatmap/
│   │   │   │   └── page.tsx                 # Activity heatmap
│   │   │   └── comparison/
│   │   │       └── page.tsx                 # Peer comparison
│   │   ├── study-plans/
│   │   │   ├── page.tsx                     # Study plans list
│   │   │   ├── create/
│   │   │   │   └── page.tsx                 # Create custom plan
│   │   │   ├── [planId]/
│   │   │   │   ├── page.tsx                 # Study plan progress
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx             # Edit study plan
│   │   │   ├── templates/
│   │   │   │   └── page.tsx                 # Pre-made plan templates
│   │   │   └── recommendations/
│   │   │       └── page.tsx                 # AI-recommended plans
│   │   ├── contests/
│   │   │   ├── page.tsx                     # Contests calendar
│   │   │   ├── upcoming/
│   │   │   │   └── page.tsx                 # Upcoming contests
│   │   │   ├── [contestId]/
│   │   │   │   ├── page.tsx                 # Contest details
│   │   │   │   └── register/
│   │   │   │       └── page.tsx             # Contest registration
│   │   │   ├── past/
│   │   │   │   └── page.tsx                 # Past contests
│   │   │   └── virtual/
│   │   │       └── page.tsx                 # Virtual contest mode
│   │   ├── challenges/
│   │   │   ├── page.tsx                     # Daily/weekly challenges
│   │   │   ├── daily/
│   │   │   │   └── page.tsx                 # Daily challenge
│   │   │   ├── weekly/
│   │   │   │   └── page.tsx                 # Weekly challenge
│   │   │   ├── [challengeId]/
│   │   │   │   └── page.tsx                 # Challenge details
│   │   │   └── create/
│   │   │       └── page.tsx                 # Create custom challenge
│   │   ├── social/
│   │   │   ├── page.tsx                     # Social feed
│   │   │   ├── friends/
│   │   │   │   ├── page.tsx                 # Friends list
│   │   │   │   ├── requests/
│   │   │   │   │   └── page.tsx             # Friend requests
│   │   │   │   └── suggestions/
│   │   │   │       └── page.tsx             # Friend suggestions
│   │   │   ├── activity/
│   │   │   │   └── page.tsx                 # Activity feed
│   │   │   ├── discussions/
│   │   │   │   ├── page.tsx                 # Discussion forum
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx             # Create discussion
│   │   │   │   └── [discussionId]/
│   │   │   │       └── page.tsx             # Discussion thread
│   │   │   └── messages/
│   │   │       ├── page.tsx                 # Messages inbox
│   │   │       └── [conversationId]/
│   │   │           └── page.tsx             # Message thread
│   │   ├── rewards/
│   │   │   ├── page.tsx                     # Rewards & shop
│   │   │   ├── shop/
│   │   │   │   └── page.tsx                 # Virtual items shop
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx                 # User inventory
│   │   │   └── history/
│   │   │       └── page.tsx                 # Reward history
│   │   ├── streaks/
│   │   │   ├── page.tsx                     # Streak dashboard
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx                 # Activity calendar
│   │   │   └── leaderboard/
│   │   │       └── page.tsx                 # Streak leaderboard
│   │   ├── resources/
│   │   │   ├── page.tsx                     # Learning resources
│   │   │   ├── tutorials/
│   │   │   │   ├── page.tsx                 # Tutorial list
│   │   │   │   └── [tutorialId]/
│   │   │   │       └── page.tsx             # Tutorial content
│   │   │   ├── articles/
│   │   │   │   └── page.tsx                 # Articles & guides
│   │   │   ├── videos/
│   │   │   │   └── page.tsx                 # Video resources
│   │   │   └── bookmarks/
│   │   │       └── page.tsx                 # Saved resources
│   │   ├── notifications/
│   │   │   └── page.tsx                     # Notifications center
│   │   ├── search/
│   │   │   └── page.tsx                     # Global search
│   │   └── help/
│   │       ├── page.tsx                     # Help center
│   │       ├── faq/
│   │       │   └── page.tsx                 # FAQ
│   │       └── support/
│   │           └── page.tsx                 # Contact support
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts                 # NextAuth handler
│   │   │   ├── register/
│   │   │   │   └── route.ts                 # User registration
│   │   │   └── verify-email/
│   │   │       └── route.ts                 # Email verification
│   │   ├── user/
│   │   │   ├── profile/
│   │   │   │   └── route.ts                 # Get/update profile
│   │   │   ├── stats/
│   │   │   │   └── route.ts                 # User statistics
│   │   │   ├── settings/
│   │   │   │   └── route.ts                 # User settings
│   │   │   └── avatar/
│   │   │       └── route.ts                 # Avatar management
│   │   ├── problems/
│   │   │   ├── route.ts                     # List problems
│   │   │   ├── [problemId]/
│   │   │   │   ├── route.ts                 # Get problem details
│   │   │   │   ├── solve/
│   │   │   │   │   └── route.ts             # Mark as solved
│   │   │   │   ├── notes/
│   │   │   │   │   └── route.ts             # Problem notes CRUD
│   │   │   │   ├── hints/
│   │   │   │   │   └── route.ts             # Get hints
│   │   │   │   └── similar/
│   │   │   │       └── route.ts             # Similar problems
│   │   │   ├── search/
│   │   │   │   └── route.ts                 # Search problems
│   │   │   ├── filter/
│   │   │   │   └── route.ts                 # Filter problems
│   │   │   ├── recommend/
│   │   │   │   └── route.ts                 # AI recommendations
│   │   │   └── stats/
│   │   │       └── route.ts                 # Problem statistics
│   │   ├── leetcode/
│   │   │   ├── route.ts                     # LeetCode API proxy
│   │   │   ├── sync/
│   │   │   │   └── route.ts                 # Sync LeetCode data
│   │   │   ├── profile/
│   │   │   │   └── route.ts                 # Fetch LeetCode profile
│   │   │   ├── submissions/
│   │   │   │   └── route.ts                 # Recent submissions
│   │   │   └── contest/
│   │   │       └── route.ts                 # Contest data
│   │   ├── leaderboard/
│   │   │   ├── global/
│   │   │   │   └── route.ts                 # Global leaderboard
│   │   │   ├── weekly/
│   │   │   │   └── route.ts                 # Weekly leaderboard
│   │   │   ├── monthly/
│   │   │   │   └── route.ts                 # Monthly leaderboard
│   │   │   ├── friends/
│   │   │   │   └── route.ts                 # Friends leaderboard
│   │   │   └── team/
│   │   │       └── route.ts                 # Team leaderboard
│   │   ├── teams/
│   │   │   ├── route.ts                     # List/create teams
│   │   │   ├── [teamId]/
│   │   │   │   ├── route.ts                 # Get/update team
│   │   │   │   ├── join/
│   │   │   │   │   └── route.ts             # Join team
│   │   │   │   ├── leave/
│   │   │   │   │   └── route.ts             # Leave team
│   │   │   │   ├── invite/
│   │   │   │   │   └── route.ts             # Invite members
│   │   │   │   ├── members/
│   │   │   │   │   └── route.ts             # Team members
│   │   │   │   └── stats/
│   │   │   │       └── route.ts             # Team statistics
│   │   │   ├── search/
│   │   │   │   └── route.ts                 # Search teams
│   │   │   └── invitations/
│   │   │       └── route.ts                 # Handle invitations
│   │   ├── battles/
│   │   │   ├── route.ts                     # List/create battles
│   │   │   ├── [battleId]/
│   │   │   │   ├── route.ts                 # Get battle details
│   │   │   │   ├── join/
│   │   │   │   │   └── route.ts             # Join battle
│   │   │   │   ├── start/
│   │   │   │   │   └── route.ts             # Start battle
│   │   │   │   ├── submit/
│   │   │   │   │   └── route.ts             # Submit solution
│   │   │   │   ├── results/
│   │   │   │   │   └── route.ts             # Battle results
│   │   │   │   └── ws/
│   │   │   │       └── route.ts             # WebSocket endpoint
│   │   │   ├── matchmaking/
│   │   │   │   └── route.ts                 # Auto matchmaking
│   │   │   └── tournaments/
│   │   │       ├── route.ts                 # Tournaments CRUD
│   │   │       └── [tournamentId]/
│   │   │           ├── route.ts             # Tournament details
│   │   │           └── register/
│   │   │               └── route.ts         # Register for tournament
│   │   ├── achievements/
│   │   │   ├── route.ts                     # List achievements
│   │   │   ├── check/
│   │   │   │   └── route.ts                 # Check & unlock
│   │   │   ├── [achievementId]/
│   │   │   │   └── route.ts                 # Achievement details
│   │   │   ├── unlock/
│   │   │   │   └── route.ts                 # Unlock achievement
│   │   │   └── progress/
│   │   │       └── route.ts                 # Achievement progress
│   │   ├── streaks/
│   │   │   ├── route.ts                     # Streak data
│   │   │   ├── update/
│   │   │   │   └── route.ts                 # Update streak
│   │   │   ├── weekly/
│   │   │   │   └── route.ts                 # Weekly streak data
│   │   │   └── calendar/
│   │   │       └── route.ts                 # Activity calendar
│   │   ├── analytics/
│   │   │   ├── overview/
│   │   │   │   └── route.ts                 # Analytics overview
│   │   │   ├── insights/
│   │   │   │   └── route.ts                 # AI insights
│   │   │   ├── patterns/
│   │   │   │   └── route.ts                 # Pattern analysis
│   │   │   ├── time-tracking/
│   │   │   │   └── route.ts                 # Time spent data
│   │   │   ├── heatmap/
│   │   │   │   └── route.ts                 # Activity heatmap
│   │   │   └── comparison/
│   │   │       └── route.ts                 # Peer comparison
│   │   ├── study-plans/
│   │   │   ├── route.ts                     # List/create plans
│   │   │   ├── [planId]/
│   │   │   │   ├── route.ts                 # Plan CRUD
│   │   │   │   ├── progress/
│   │   │   │   │   └── route.ts             # Track progress
│   │   │   │   └── complete/
│   │   │   │       └── route.ts             # Complete plan
│   │   │   ├── templates/
│   │   │   │   └── route.ts                 # Plan templates
│   │   │   └── recommendations/
│   │   │       └── route.ts                 # Recommended plans
│   │   ├── revision/
│   │   │   ├── schedule/
│   │   │   │   └── route.ts                 # Spaced repetition
│   │   │   ├── sessions/
│   │   │   │   ├── route.ts                 # Revision sessions
│   │   │   │   └── [sessionId]/
│   │   │   │       └── route.ts             # Session management
│   │   │   └── notes/
│   │   │       └── route.ts                 # Revision notes
│   │   ├── contests/
│   │   │   ├── route.ts                     # Contest list
│   │   │   ├── [contestId]/
│   │   │   │   ├── route.ts                 # Contest details
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts             # Register
│   │   │   │   └── standings/
│   │   │   │       └── route.ts             # Contest standings
│   │   │   └── upcoming/
│   │   │       └── route.ts                 # Upcoming contests
│   │   ├── challenges/
│   │   │   ├── route.ts                     # Challenge CRUD
│   │   │   ├── daily/
│   │   │   │   └── route.ts                 # Daily challenge
│   │   │   ├── weekly/
│   │   │   │   └── route.ts                 # Weekly challenge
│   │   │   └── [challengeId]/
│   │   │       ├── route.ts                 # Challenge details
│   │   │       └── submit/
│   │   │           └── route.ts             # Submit solution
│   │   ├── social/
│   │   │   ├── feed/
│   │   │   │   └── route.ts                 # Activity feed
│   │   │   ├── friends/
│   │   │   │   ├── route.ts                 # Friends list
│   │   │   │   ├── add/
│   │   │   │   │   └── route.ts             # Send friend request
│   │   │   │   ├── remove/
│   │   │   │   │   └── route.ts             # Remove friend
│   │   │   │   ├── requests/
│   │   │   │   │   └── route.ts             # Friend requests
│   │   │   │   └── suggestions/
│   │   │   │       └── route.ts             # Friend suggestions
│   │   │   ├── discussions/
│   │   │   │   ├── route.ts                 # Forum CRUD
│   │   │   │   └── [discussionId]/
│   │   │   │       ├── route.ts             # Discussion details
│   │   │   │       └── comments/
│   │   │   │           └── route.ts         # Comments
│   │   │   └── messages/
│   │   │       ├── route.ts                 # Message list
│   │   │       ├── send/
│   │   │       │   └── route.ts             # Send message
│   │   │       └── [conversationId]/
│   │   │           └── route.ts             # Conversation
│   │   ├── rewards/
│   │   │   ├── route.ts                     # Reward system
│   │   │   ├── shop/
│   │   │   │   └── route.ts                 # Virtual shop
│   │   │   ├── purchase/
│   │   │   │   └── route.ts                 # Purchase item
│   │   │   ├── inventory/
│   │   │   │   └── route.ts                 # User inventory
│   │   │   └── claim/
│   │   │       └── route.ts                 # Claim reward
│   │   ├── notifications/
│   │   │   ├── route.ts                     # Get notifications
│   │   │   ├── mark-read/
│   │   │   │   └── route.ts                 # Mark as read
│   │   │   ├── preferences/
│   │   │   │   └── route.ts                 # Notification settings
│   │   │   └── clear/
│   │   │       └── route.ts                 # Clear notifications
│   │   ├── webhooks/
│   │   │   ├── supabase/
│   │   │   │   └── route.ts                 # Supabase webhooks
│   │   │   └── stripe/
│   │   │       └── route.ts                 # Stripe webhooks
│   │   ├── ai/
│   │   │   ├── hint/
│   │   │   │   └── route.ts                 # AI hints
│   │   │   ├── explain/
│   │   │   │   └── route.ts                 # Code explanation
│   │   │   ├── insights/
│   │   │   │   └── route.ts                 # Performance insights
│   │   │   └── recommend/
│   │   │       └── route.ts                 # Problem recommendations
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   └── route.ts                 # User management
│   │   │   ├── problems/
│   │   │   │   └── route.ts                 # Problem management
│   │   │   └── analytics/
│   │   │       └── route.ts                 # Platform analytics
│   │   ├── cron/
│   │   │   ├── daily-challenge/
│   │   │   │   └── route.ts                 # Generate daily challenge
│   │   │   ├── leaderboard-update/
│   │   │   │   └── route.ts                 # Update leaderboards
│   │   │   └── streak-check/
│   │   │       └── route.ts                 # Check user streaks
│   │   └── health/
│   │       └── route.ts                     # Health check
│   ├── layout.tsx                           # Root layout
│   ├── globals.css                          # Global styles
│   ├── providers.tsx                        # React context providers
│   ├── error.tsx                            # Error boundary
│   ├── not-found.tsx                        # 404 page
│   └── loading.tsx                          # Loading state
│
├── components/
│   ├── auth/
│   │   ├── LoginButton.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── SocialLogin.tsx
│   │   ├── PasswordReset.tsx
│   │   └── AuthGuard.tsx
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── RaceTrack.tsx
│   │   ├── WeeklyStreak.tsx
│   │   ├── Navigation.tsx
│   │   ├── QuickStats.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── UpcomingEvents.tsx
│   │   └── RecentActivity.tsx
│   ├── teams/
│   │   ├── TeamCard.tsx
│   │   ├── TeamRaceTrack.tsx
│   │   ├── TeamActivity.tsx
│   │   ├── CreateTeamModal.tsx
│   │   ├── JoinTeamModal.tsx
│   │   ├── TeamInviteModal.tsx
│   │   ├── TeamMembersList.tsx
│   │   ├── TeamLeaderboard.tsx
│   │   ├── TeamSettings.tsx
│   │   ├── TeamBadge.tsx
│   │   └── TeamChallenges.tsx
│   ├── problems/
│   │   ├── ProblemList.tsx
│   │   ├── ProblemCard.tsx
│   │   ├── ProblemDetail.tsx
│   │   ├── ProblemFilters.tsx
│   │   ├── TrackSelector.tsx
│   │   ├── ProblemNotesModal.tsx
│   │   ├── ProblemSearch.tsx
│   │   ├── DifficultyBadge.tsx
│   │   ├── TopicTag.tsx
│   │   ├── SimilarProblems.tsx
│   │   ├── ProblemHints.tsx
│   │   ├── SolutionViewer.tsx
│   │   ├── CodeEditor.tsx
│   │   └── ProblemTimer.tsx
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   ├── PlayerCard.tsx
│   │   ├── ProfileModal.tsx
│   │   ├── RankBadge.tsx
│   │   ├── LeaderboardFilters.tsx
│   │   ├── WeeklyLeaderboard.tsx
│   │   ├── MonthlyLeaderboard.tsx
│   │   └── FriendsLeaderboard.tsx
│   ├── battles/
│   │   ├── BattleCard.tsx
│   │   ├── CreateBattleModal.tsx
│   │   ├── BattleRoom.tsx
│   │   ├── BattleLobby.tsx
│   │   ├── BattleTimer.tsx
│   │   ├── BattleResults.tsx
│   │   ├── BattleReplay.tsx
│   │   ├── MatchmakingQueue.tsx
│   │   ├── TournamentBracket.tsx
│   │   ├── TournamentCard.tsx
│   │   └── LiveBattleIndicator.tsx
│   ├── achievements/
│   │   ├── AchievementCard.tsx
│   │   ├── AchievementGrid.tsx
│   │   ├── UnlockAnimation.tsx
│   │   ├── AchievementProgress.tsx
│   │   ├── AchievementDetail.tsx
│   │   ├── MilestoneTracker.tsx
│   │   ├── BadgeShowcase.tsx
│   │   └── AchievementToast.tsx
│   ├── profile/
│   │   ├── LeetCodeIntegration.tsx
│   │   ├── ProfileStats.tsx
│   │   ├── AvatarPicker.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileTabs.tsx
│   │   ├── EditProfile.tsx
│   │   ├── SubmissionHistory.tsx
│   │   ├── ProfileBadges.tsx
│   │   ├── ActivityHeatmap.tsx
│   │   ├── SocialLinks.tsx
│   │   └── ProfileSettings.tsx
│   ├── analytics/
│   │   ├── OverviewDashboard.tsx
│   │   ├── InsightsPanel.tsx
│   │   ├── PatternAnalysis.tsx
│   │   ├── TimeTrackingChart.tsx
│   │   ├── DifficultyBreakdown.tsx
│   │   ├── TopicDistribution.tsx
│   │   ├── ProgressGraph.tsx
│   │   ├── ComparisonChart.tsx
│   │   ├── WeeklyProgress.tsx
│   │   └── StatsGrid.tsx
│   ├── study-plans/
│   │   ├── StudyPlanCard.tsx
│   │   ├── CreatePlanForm.tsx
│   │   ├── PlanProgress.tsx
│   │   ├── PlanCalendar.tsx
│   │   ├── PlanTemplates.tsx
│   │   ├── CustomPlanBuilder.tsx
│   │   ├── PlanRecommendations.tsx
│   │   └── DailyGoals.tsx
│   ├── revision/
│   │   ├── RevisionDashboard.tsx
│   │   ├── SpacedRepetition.tsx
│   │   ├── RevisionSession.tsx
│   │   ├── RevisionCalendar.tsx
│   │   ├── RevisionNotes.tsx
│   │   ├── ProblemRevisionCard.tsx
│   │   └── RevisionStats.tsx
│   ├── contests/
│   │   ├── ContestCard.tsx
│   │   ├── ContestCalendar.tsx
│   │   ├── ContestDetails.tsx
│   │   ├── ContestRegistration.tsx
│   │   ├── ContestStandings.tsx
│   │   ├── ContestTimer.tsx
│   │   ├── VirtualContest.tsx
│   │   └── UpcomingContests.tsx
│   ├── challenges/
│   │   ├── ChallengeCard.tsx
│   │   ├── DailyChallenge.tsx
│   │   ├── WeeklyChallenge.tsx
│   │   ├── CreateChallengeForm.tsx
│   │   ├── ChallengeTimer.tsx
│   │   ├── ChallengeResults.tsx
│   │   └── ChallengeStreak.tsx
│   ├── social/
│   │   ├── ActivityFeed.tsx
│   │   ├── FriendsList.tsx
│   │   ├── FriendCard.tsx
│   │   ├── FriendRequests.tsx
│   │   ├── FriendSuggestions.tsx
│   │   ├── DiscussionCard.tsx
│   │   ├── DiscussionThread.tsx
│   │   ├── CreateDiscussion.tsx
│   │   ├── CommentSection.tsx
│   │   ├── MessageInbox.tsx
│   │   ├── MessageThread.tsx
│   │   ├── SendMessage.tsx
│   │   └── OnlineStatus.tsx
│   ├── rewards/
│   │   ├── RewardShop.tsx
│   │   ├── ShopItem.tsx
│   │   ├── UserInventory.tsx
│   │   ├── PurchaseModal.tsx
│   │   ├── RewardHistory.tsx
│   │   ├── PointsDisplay.tsx
│   │   └── RewardNotification.tsx
│   ├── streaks/
│   │   ├── StreakCounter.tsx
│   │   ├── StreakCalendar.tsx
│   │   ├── StreakChart.tsx
│   │   ├── StreakLeaderboard.tsx
│   │   ├── StreakMilestone.tsx
│   │   └── StreakReminder.tsx
│   ├── notifications/
│   │   ├── NotificationCenter.tsx
│   │   ├── NotificationItem.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationSettings.tsx
│   │   └── ToastNotification.tsx
│   ├── search/
│   │   ├── GlobalSearch.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   ├── SearchFilters.tsx
│   │   └── RecentSearches.tsx
│   ├── common/
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Pagination.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Toast.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Dropdown.tsx
│   │   ├── DatePicker.tsx
│   │   ├── TimePicker.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── FileUploader.tsx
│   │   ├── ImageCropper.tsx
│   │   ├── MarkdownEditor.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── Skeleton.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── ScrollToTop.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       ├── Checkbox.tsx
│       ├── Radio.tsx
│       ├── Switch.tsx
│       ├── Slider.tsx
│       ├── Badge.tsx
│       ├── Alert.tsx
│       ├── Tabs.tsx
│       ├── Accordion.tsx
│       ├── Dialog.tsx
│       ├── Sheet.tsx
│       ├── Popover.tsx
│       ├── ContextMenu.tsx
│       ├── Avatar.tsx
│       ├── AvatarGroup.tsx
│       └── Separator.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                        # Supabase client
│   │   ├── server.ts                        # Supabase server
│   │   ├── middleware.ts                    # Auth middleware
│   │   ├── queries.ts                       # Reusable queries
│   │   └── realtime.ts                      # Realtime subscriptions
│   ├── hooks/
│   │   ├── useUser.ts
│   │   ├── useTeam.ts
│   │   ├── useLeaderboard.ts
│   │   ├── useAchievements.ts
│   │   ├── useBattles.ts
│   │   ├── useProblems.ts
│   │   ├── useAnalytics.ts
│   │   ├── useStudyPlan.ts
│   │   ├── useRevision.ts
│   │   ├── useContests.ts
│   │   ├── useChallenges.ts
│   │   ├── useNotifications.ts
│   │   ├── useFriends.ts
│   │   ├── useMessages.ts
│   │   ├── useRewards.ts
│   │   ├── useStreaks.ts
│   │   ├── useSearch.ts
│   │   ├── useWebSocket.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useClickOutside.ts
│   │   ├── useKeyPress.ts
│   │   ├── useCopyToClipboard.ts
│   │   └── useTimer.ts
│   ├── services/
│   │   ├── userService.ts
│   │   ├── teamService.ts
│   │   ├── problemService.ts
│   │   ├── achievementService.ts
│   │   ├── battleService.ts
│   │   ├── leetcodeService.ts
│   │   ├── analyticsService.ts
│   │   ├── studyPlanService.ts
│   │   ├── revisionService.ts
│   │   ├── contestService.ts
│   │   ├── challengeService.ts
│   │   ├── socialService.ts
│   │   ├── notificationService.ts
│   │   ├── rewardService.ts
│   │   ├── streakService.ts
│   │   ├── searchService.ts
│   │   ├── aiService.ts
│   │   ├── cacheService.ts
│   │   ├── emailService.ts
│   │   └── storageService.ts
│   ├── utils/
│   │   ├── avatars.ts
│   │   ├── problemData.ts
│   │   ├── calculations.ts
│   │   ├── notifications.ts
│   │   ├── dateUtils.ts
│   │   ├── stringUtils.ts
│   │   ├── numberUtils.ts
│   │   ├── arrayUtils.ts
│   │   ├── objectUtils.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   ├── errorHandling.ts
│   │   ├── logger.ts
│   │   ├── analytics.ts
│   │   ├── performance.ts
│   │   ├── security.ts
│   │   ├── encryption.ts
│   │   └── helpers.ts
│   ├── types/
│   │   ├── database.types.ts
│   │   ├── user.types.ts
│   │   ├── team.types.ts
│   │   ├── problem.types.ts
│   │   ├── battle.types.ts
│   │   ├── achievement.types.ts
│   │   ├── analytics.types.ts
│   │   ├── contest.types.ts
│   │   ├── challenge.types.ts
│   │   ├── social.types.ts
│   │   ├── notification.types.ts
│   │   ├── reward.types.ts
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── SocketContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── AnalyticsContext.tsx
│   ├── store/
│   │   ├── index.ts                         # Redux/Zustand store
│   │   ├── userSlice.ts
│   │   ├── problemsSlice.ts
│   │   ├── teamsSlice.ts
│   │   ├── battlesSlice.ts
│   │   ├── notificationsSlice.ts
│   │   └── uiSlice.ts
│   ├── config/
│   │   ├── site.ts                          # Site configuration
│   │   ├── achievements.ts                  # Achievement definitions
│   │   ├── badges.ts                        # Badge definitions
│   │   ├── tracks.ts                        # Problem tracks config
│   │   ├── rewards.ts                       # Reward system config
│   │   ├── points.ts                        # Points calculation
│   │   └── constants.ts                     # Global constants
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── ai/
│   │   ├── hintGenerator.ts
│   │   ├── codeExplainer.ts
│   │   ├── insightsEngine.ts
│   │   ├── recommendationEngine.ts
│   │   └── patternAnalyzer.ts
│   └── websocket/
│       ├── client.ts
│       ├── server.ts
│       ├── handlers/
│       │   ├── battleHandler.ts
│       │   ├── chatHandler.ts
│       │   └── notificationHandler.ts
│       └── events.ts
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── avatars/
│   │   │   ├── badges/
│   │   │   ├── achievements/
│   │   │   ├── icons/
│   │   │   └── illustrations/
│   │   ├── animations/
│   │   │   └── lottie/
│   │   ├── sounds/
│   │   │   ├── achievement.mp3
│   │   │   ├── notification.mp3
│   │   │   └── battle-start.mp3
│   │   └── videos/
│   ├── fonts/
│   ├── manifest.json
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.ico
│   └── sw.js                                # Service worker
│
├── supabase/
│   ├── schema.sql                           # Complete database schema
│   ├── migrations/
│   │   ├── 001_initial_setup.sql
│   │   ├── 002_add_teams.sql
│   │   ├── 003_add_battles.sql
│   │   ├── 004_add_achievements.sql
│   │   ├── 005_add_social.sql
│   │   ├── 006_add_analytics.sql
│   │   └── 007_add_indexes.sql
│   ├── functions/
│   │   ├── check-achievements.sql
│   │   ├── update-leaderboard.sql
│   │   ├── calculate-streak.sql
│   │   └── match-users.sql
│   └── seed.sql                             # Seed data
│
├── scripts/
│   ├── setup.sh                             # Initial setup script
│   ├── migrate.sh                           # Database migration
│   ├── seed.sh                              # Seed database
│   ├── backup.sh                            # Backup database
│   ├── deploy.sh                            # Deployment script
│   └── generate-types.sh                    # Generate TypeScript types
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   ├── utils/
│   │   └── hooks/
│   ├── integration/
│   │   ├── api/
│   │   └── components/
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── problems.spec.ts
│   │   ├── battles.spec.ts
│   │   └── profile.spec.ts
│   ├── setup.ts
│   └── helpers.ts
│
├── docs/
│   ├── README.md
│   ├── API.md                               # API documentation
│   ├── ARCHITECTURE.md                      # Architecture guide
│   ├── DEPLOYMENT.md                        # Deployment guide
│   ├── CONTRIBUTING.md                      # Contributing guide
│   └── CHANGELOG.md                         # Changelog
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                           # CI pipeline
│   │   ├── deploy.yml                       # Deployment workflow
│   │   └── test.yml                         # Testing workflow
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .env.local                               # Environment variables
├── .env.example                             # Environment template
├── .eslintrc.json                           # ESLint config
├── .prettierrc                              # Prettier config
├── .gitignore
├── next.config.js                           # Next.js config
├── tailwind.config.js                       # Tailwind config
├── tsconfig.json                            # TypeScript config
├── package.json
├── package-lock.json
├── jest.config.js                           # Jest config
├── playwright.config.ts                     # Playwright config
├── postcss.config.js                        # PostCSS config
├── vercel.json                              # Vercel config
├── docker-compose.yml                       # Docker setup
├── Dockerfile
└── README.md

