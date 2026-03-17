# AI Fitness Logger

## Current State
The app has Dashboard, Log Workout, History, AI Suggestions, Profile, Survey, and AI Mentor tabs. There is a monetization system (5 free trials, ₹500/month subscription), interstitial ads, and a sponsor banner. No streak, rewards, or challenge features exist.

## Requested Changes (Diff)

### Add
- **Streaks system**: Track consecutive workout days. Store/read from localStorage. Show current streak, longest streak, and a 7-day mini calendar heatmap on a new Challenges page.
- **Daily Challenges**: A set of rotating daily challenges (e.g., "Log a leg workout", "Burn 200+ kcal", "Complete 3 sets of bench press"). Challenges reset each calendar day. Completion tracked in localStorage.
- **Rewards/Badges**: Earn badges for milestones (e.g., 7-day streak, 30 workouts logged, first 500 kcal session). Display earned/locked badges on the Challenges page.
- **Streak widget on Dashboard**: Small streak counter card in the stats row (🔥 streak flame icon).
- **Challenges nav link**: Add "Challenges" tab to navigation.

### Modify
- `Layout.tsx`: Add Challenges nav item.
- `App.tsx`: Register `/challenges` route.
- `Dashboard.tsx`: Add streak counter card to the stats grid.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/context/StreakContext.tsx` -- manages streak state, daily challenges, and badge logic using localStorage.
2. Create `src/frontend/src/pages/Challenges.tsx` -- full Challenges page: streak display, 7-day heatmap, daily challenges list, rewards/badges grid.
3. Update `App.tsx` -- add `/challenges` route.
4. Update `Layout.tsx` -- add Challenges nav item with Trophy icon.
5. Update `Dashboard.tsx` -- add streak stat card in stats grid.
6. Wrap app with `StreakProvider` in `App.tsx`.
