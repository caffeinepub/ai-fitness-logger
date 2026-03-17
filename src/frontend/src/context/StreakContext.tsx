import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ─── Storage Keys ────────────────────────────────────────────────────────────
const KEYS = {
  lastWorkoutDate: "streak_lastWorkoutDate",
  current: "streak_current",
  longest: "streak_longest",
  workoutDates: "streak_workoutDates",
  challengesDate: "challenges_date",
  challengesCompleted: "challenges_completed",
  badgesEarned: "badges_earned",
  totalXP: "total_xp",
  totalChallengesCompleted: "total_challenges_completed",
};

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// ─── Challenge Pool ───────────────────────────────────────────────────────────
const CHALLENGE_POOL: Challenge[] = [
  {
    id: "c_3sets",
    title: "Triple Set",
    description: "Complete 3 sets for any exercise",
    icon: "🔱",
    xp: 20,
  },
  {
    id: "c_squat",
    title: "Leg Day Hero",
    description: "Log a squat or leg press workout",
    icon: "🦵",
    xp: 25,
  },
  {
    id: "c_bench",
    title: "Push Power",
    description: "Log a bench press or push-up session",
    icon: "💪",
    xp: 20,
  },
  {
    id: "c_deadlift",
    title: "Iron Pull",
    description: "Log a deadlift workout today",
    icon: "🏋️",
    xp: 30,
  },
  {
    id: "c_cardio",
    title: "Cardio Burst",
    description: "Add a cardio exercise to your session",
    icon: "🏃",
    xp: 15,
  },
  {
    id: "c_100kg",
    title: "Century Club",
    description: "Lift a total of 100 kg in one session",
    icon: "💯",
    xp: 35,
  },
  {
    id: "c_protein",
    title: "Protein Target",
    description: "Check your protein intake goal today",
    icon: "🥩",
    xp: 10,
  },
  {
    id: "c_hydrate",
    title: "Stay Hydrated",
    description: "Log your workout and drink 2L of water",
    icon: "💧",
    xp: 15,
  },
  {
    id: "c_morning",
    title: "Early Bird",
    description: "Log a workout before noon",
    icon: "🌅",
    xp: 25,
  },
  {
    id: "c_5exercises",
    title: "Variety Pack",
    description: "Log 5 different exercises in one session",
    icon: "⚡",
    xp: 40,
  },
  {
    id: "c_pullday",
    title: "Pull Day",
    description: "Log a pull-up or row exercise",
    icon: "🔙",
    xp: 20,
  },
  {
    id: "c_core",
    title: "Core Crusher",
    description: "Add a core or plank exercise today",
    icon: "🎯",
    xp: 20,
  },
  {
    id: "c_survey",
    title: "Self Reflect",
    description: "Complete one section of the fitness survey",
    icon: "📋",
    xp: 15,
  },
  {
    id: "c_mentor",
    title: "Ask the Coach",
    description: "Consult the AI Mentor for advice",
    icon: "🤖",
    xp: 10,
  },
  {
    id: "c_share",
    title: "Milestone Moment",
    description: "Beat your personal best weight today",
    icon: "🏆",
    xp: 50,
  },
];

// ─── Badge Definitions ────────────────────────────────────────────────────────
export const BADGES: Badge[] = [
  {
    id: "first_workout",
    name: "First Rep",
    description: "Log your very first workout",
    icon: "🎉",
  },
  {
    id: "streak_3",
    name: "On Fire",
    description: "Maintain a 3-day workout streak",
    icon: "🔥",
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Achieve a 7-day workout streak",
    icon: "⚔️",
  },
  {
    id: "streak_30",
    name: "Iron Discipline",
    description: "30-day streak – legendary dedication",
    icon: "🛡️",
  },
  {
    id: "workouts_5",
    name: "Getting Started",
    description: "Log 5 total workouts",
    icon: "🌱",
  },
  {
    id: "workouts_10",
    name: "Consistent",
    description: "Log 10 total workouts",
    icon: "📈",
  },
  {
    id: "workouts_30",
    name: "Veteran Lifter",
    description: "Log 30 total workouts",
    icon: "🦾",
  },
  {
    id: "challenge_5",
    name: "Challenge Accepted",
    description: "Complete 5 daily challenges",
    icon: "✅",
  },
  {
    id: "challenge_20",
    name: "Challenge Master",
    description: "Complete 20 daily challenges",
    icon: "🎖️",
  },
  {
    id: "xp_500",
    name: "XP Collector",
    description: "Earn 500 total XP",
    icon: "⭐",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyChallengeSeed(dateStr: string): Challenge[] {
  // Use date as deterministic seed to pick 5 challenges
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) & 0xffffffff;
  }
  const pool = [...CHALLENGE_POOL];
  const selected: Challenge[] = [];
  let seed = Math.abs(hash);
  while (selected.length < 5 && pool.length > 0) {
    const idx = seed % pool.length;
    selected.push(pool.splice(idx, 1)[0]);
    seed = Math.floor(seed / 7 + 13) ^ (seed << 3);
    seed = Math.abs(seed);
  }
  return selected;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface StreakContextValue {
  currentStreak: number;
  longestStreak: number;
  workoutDates: string[];
  totalXP: number;
  dailyChallenges: Challenge[];
  completedChallengeIds: string[];
  earnedBadgeIds: string[];
  recordWorkout: (date?: string) => void;
  completeChallenge: (id: string) => void;
}

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: { children: React.ReactNode }) {
  const [currentStreak, setCurrentStreak] = useState(() =>
    Number(localStorage.getItem(KEYS.current) ?? 0),
  );
  const [longestStreak, setLongestStreak] = useState(() =>
    Number(localStorage.getItem(KEYS.longest) ?? 0),
  );
  const [workoutDates, setWorkoutDates] = useState<string[]>(() =>
    readJSON(KEYS.workoutDates, []),
  );
  const [totalXP, setTotalXP] = useState(() =>
    Number(localStorage.getItem(KEYS.totalXP) ?? 0),
  );
  const [totalChallengesCompleted, setTotalChallengesCompleted] = useState(() =>
    Number(localStorage.getItem(KEYS.totalChallengesCompleted) ?? 0),
  );
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>(() =>
    readJSON(KEYS.badgesEarned, []),
  );

  // Daily challenges — reset when date changes
  const [challengesDate, setChallengesDate] = useState(
    () => localStorage.getItem(KEYS.challengesDate) ?? "",
  );
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    () => {
      const today = todayStr();
      const storedDate = localStorage.getItem(KEYS.challengesDate);
      if (storedDate === today) {
        return readJSON(KEYS.challengesCompleted, []);
      }
      return [];
    },
  );

  const today = todayStr();
  const dailyChallenges = useMemo(() => getDailyChallengeSeed(today), [today]);

  // Reset challenges when date changes
  useEffect(() => {
    if (challengesDate !== today) {
      setChallengesDate(today);
      setCompletedChallengeIds([]);
      localStorage.setItem(KEYS.challengesDate, today);
      localStorage.setItem(KEYS.challengesCompleted, JSON.stringify([]));
    }
  }, [today, challengesDate]);

  const earnBadge = useCallback((id: string, currentEarned: string[]) => {
    if (!currentEarned.includes(id)) {
      const next = [...currentEarned, id];
      setEarnedBadgeIds(next);
      localStorage.setItem(KEYS.badgesEarned, JSON.stringify(next));
      return next;
    }
    return currentEarned;
  }, []);

  const checkBadges = useCallback(
    (
      streak: number,
      workouts: string[],
      xp: number,
      totalChallenges: number,
      currentEarned: string[],
    ) => {
      let earned = [...currentEarned];
      if (workouts.length >= 1) earned = earnBadge("first_workout", earned);
      if (streak >= 3) earned = earnBadge("streak_3", earned);
      if (streak >= 7) earned = earnBadge("streak_7", earned);
      if (streak >= 30) earned = earnBadge("streak_30", earned);
      if (workouts.length >= 5) earned = earnBadge("workouts_5", earned);
      if (workouts.length >= 10) earned = earnBadge("workouts_10", earned);
      if (workouts.length >= 30) earned = earnBadge("workouts_30", earned);
      if (totalChallenges >= 5) earned = earnBadge("challenge_5", earned);
      if (totalChallenges >= 20) earned = earnBadge("challenge_20", earned);
      if (xp >= 500) earned = earnBadge("xp_500", earned);
      return earned;
    },
    [earnBadge],
  );

  const recordWorkout = useCallback(
    (date?: string) => {
      const d = date ?? todayStr();

      setWorkoutDates((prev) => {
        const next = prev.includes(d) ? prev : [...prev, d];
        localStorage.setItem(KEYS.workoutDates, JSON.stringify(next));

        // Recalculate streak
        const sorted = [...next].sort();
        let streak = 1;
        const today2 = todayStr();
        // Check if today or yesterday is the most recent
        const lastDate = sorted[sorted.length - 1];
        if (lastDate !== today2) {
          const diff =
            (new Date(today2).getTime() - new Date(lastDate).getTime()) /
            86400000;
          if (diff > 1) streak = 0;
        }
        // Count backward from last date
        if (streak > 0) {
          for (let i = sorted.length - 2; i >= 0; i--) {
            const diff =
              (new Date(sorted[i + 1]).getTime() -
                new Date(sorted[i]).getTime()) /
              86400000;
            if (diff === 1) streak++;
            else break;
          }
        }

        setCurrentStreak(streak);
        localStorage.setItem(KEYS.current, String(streak));

        setLongestStreak((prevLongest) => {
          const nextLongest = Math.max(prevLongest, streak);
          localStorage.setItem(KEYS.longest, String(nextLongest));
          return nextLongest;
        });

        setEarnedBadgeIds((prevEarned) =>
          checkBadges(
            streak,
            next,
            totalXP,
            totalChallengesCompleted,
            prevEarned,
          ),
        );

        return next;
      });
    },
    [totalXP, totalChallengesCompleted, checkBadges],
  );

  const completeChallenge = useCallback(
    (id: string) => {
      setCompletedChallengeIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        localStorage.setItem(KEYS.challengesCompleted, JSON.stringify(next));

        const challenge = dailyChallenges.find((c) => c.id === id);
        const xpGain = challenge?.xp ?? 10;

        setTotalXP((prevXP) => {
          const nextXP = prevXP + xpGain;
          localStorage.setItem(KEYS.totalXP, String(nextXP));

          setTotalChallengesCompleted((prevTC) => {
            const nextTC = prevTC + 1;
            localStorage.setItem(KEYS.totalChallengesCompleted, String(nextTC));
            setEarnedBadgeIds((prevEarned) =>
              checkBadges(
                currentStreak,
                workoutDates,
                nextXP,
                nextTC,
                prevEarned,
              ),
            );
            return nextTC;
          });

          return nextXP;
        });

        return next;
      });
    },
    [dailyChallenges, currentStreak, workoutDates, checkBadges],
  );

  const value = useMemo(
    () => ({
      currentStreak,
      longestStreak,
      workoutDates,
      totalXP,
      dailyChallenges,
      completedChallengeIds,
      earnedBadgeIds,
      recordWorkout,
      completeChallenge,
    }),
    [
      currentStreak,
      longestStreak,
      workoutDates,
      totalXP,
      dailyChallenges,
      completedChallengeIds,
      earnedBadgeIds,
      recordWorkout,
      completeChallenge,
    ],
  );

  return (
    <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error("useStreak must be used within StreakProvider");
  return ctx;
}
