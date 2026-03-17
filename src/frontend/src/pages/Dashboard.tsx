import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Dumbbell,
  Flame,
  Plus,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useStreak } from "../context/StreakContext";
import {
  useSessionStats,
  useUserProfile,
  useWorkoutSessions,
} from "../hooks/useQueries";

const SAMPLE_SESSIONS = [
  {
    date: "2026-03-15",
    exercises: [
      {
        name: "Squat",
        sets: BigInt(4),
        reps: BigInt(8),
        weight: 100,
        caloriesBurned: 160,
        metValue: 5.0,
      },
      {
        name: "Deadlift",
        sets: BigInt(3),
        reps: BigInt(5),
        weight: 120,
        caloriesBurned: 108,
        metValue: 6.0,
      },
    ],
    totalCalories: 268,
  },
  {
    date: "2026-03-13",
    exercises: [
      {
        name: "Bench Press",
        sets: BigInt(4),
        reps: BigInt(8),
        weight: 80,
        caloriesBurned: 128,
        metValue: 5.0,
      },
      {
        name: "Overhead Press",
        sets: BigInt(3),
        reps: BigInt(10),
        weight: 50,
        caloriesBurned: 67.5,
        metValue: 4.5,
      },
      {
        name: "Barbell Row",
        sets: BigInt(4),
        reps: BigInt(8),
        weight: 70,
        caloriesBurned: 112,
        metValue: 5.0,
      },
    ],
    totalCalories: 307.5,
  },
  {
    date: "2026-03-11",
    exercises: [
      {
        name: "Pull-Up",
        sets: BigInt(4),
        reps: BigInt(8),
        weight: 0,
        caloriesBurned: 88,
        metValue: 5.5,
      },
      {
        name: "Leg Press",
        sets: BigInt(4),
        reps: BigInt(12),
        weight: 150,
        caloriesBurned: 96,
        metValue: 4.0,
      },
    ],
    totalCalories: 184,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function calcSessionWeight(
  exercises: { weight: number; sets: bigint; reps: bigint }[],
) {
  return exercises.reduce(
    (sum, e) => sum + e.weight * Number(e.sets) * Number(e.reps),
    0,
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useSessionStats();
  const { data: sessions, isLoading: sessionsLoading } = useWorkoutSessions();
  const { data: profile } = useUserProfile();
  const { currentStreak } = useStreak();

  const displaySessions =
    sessions && sessions.length > 0 ? sessions : SAMPLE_SESSIONS;
  const recentSessions = [...displaySessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const statCardConfig = [
    {
      gradientFrom: "oklch(0.84 0.24 130 / 0.18)",
      borderColor: "oklch(0.84 0.24 130 / 0.5)",
      valueClass: "text-gradient-lime",
      iconBg: "bg-primary/10",
      iconClass: "text-primary",
      glowClass: "glow-lime-hover",
      icon: Trophy,
      label: "Total Workouts",
      value: statsLoading
        ? null
        : stats
          ? Number(stats.totalSessions)
          : SAMPLE_SESSIONS.length,
    },
    {
      gradientFrom: "oklch(0.68 0.22 45 / 0.18)",
      borderColor: "oklch(0.68 0.22 45 / 0.5)",
      valueClass: "text-accent",
      iconBg: "bg-accent/10",
      iconClass: "text-accent",
      glowClass: "glow-accent-hover",
      icon: Dumbbell,
      label: "Total Weight Lifted",
      value: statsLoading
        ? null
        : stats
          ? `${stats.totalWeightLifted.toLocaleString()} kg`
          : `${SAMPLE_SESSIONS.reduce((s, sess) => s + calcSessionWeight(sess.exercises), 0).toLocaleString()} kg`,
    },
    {
      gradientFrom: "oklch(0.6 0.25 20 / 0.18)",
      borderColor: "oklch(0.6 0.25 20 / 0.5)",
      valueClass: "text-destructive",
      iconBg: "bg-destructive/10",
      iconClass: "text-destructive",
      glowClass: "glow-destructive-hover",
      icon: Flame,
      label: "Calories Burned",
      value: statsLoading
        ? null
        : stats
          ? `${Math.round(stats.totalCaloriesBurned).toLocaleString()} kcal`
          : `${Math.round(SAMPLE_SESSIONS.reduce((s, sess) => s + sess.totalCalories, 0)).toLocaleString()} kcal`,
    },
    {
      gradientFrom: "oklch(0.65 0.22 35 / 0.18)",
      borderColor: "oklch(0.65 0.22 35 / 0.5)",
      valueClass: "",
      valueStyle: { color: "oklch(0.85 0.22 40)" },
      iconBg: "bg-orange-500/10",
      iconClass: "",
      iconStyle: { color: "oklch(0.75 0.22 40)" },
      glowClass: "",
      icon: Flame,
      label: "Current Streak",
      value: `${currentStreak} day${currentStreak !== 1 ? "s" : ""}`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">
            {profile ? `Hey, ${profile.name.split(" ")[0]} 👋` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your strength journey
          </p>
        </div>
        <Link to="/log">
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-lime"
            data-ocid="dashboard.log.primary_button"
          >
            <Plus className="w-4 h-4" />
            Log Workout
          </Button>
        </Link>
      </motion.div>

      {/* Profile prompt */}
      {!profile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Alert className="border-primary/30 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Complete your profile for accurate calorie calculations.
              </span>
              <Link to="/profile">
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary p-0 h-auto"
                >
                  Set up profile →
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCardConfig.map((cfg, i) => {
          const StatIcon = cfg.icon;
          return (
            <motion.div
              key={cfg.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Card
                className={`card-elevated transition-transform hover:scale-[1.02] cursor-default ${
                  cfg.glowClass ?? ""
                }`}
                style={{
                  borderTopColor: cfg.borderColor,
                  borderTopWidth: "1px",
                  background: `linear-gradient(180deg, ${cfg.gradientFrom} 0%, oklch(var(--card)) 40%)`,
                }}
                data-ocid="dashboard.stats.card"
              >
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">
                        {cfg.label}
                      </p>
                      {statsLoading && i < 3 ? (
                        <Skeleton
                          className="h-7 w-16 mt-1"
                          data-ocid="dashboard.stats.loading_state"
                        />
                      ) : (
                        <p
                          className={`text-xl font-display font-bold mt-1 ${
                            cfg.valueClass ?? ""
                          }`}
                          style={cfg.valueStyle}
                        >
                          {cfg.value}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg ${cfg.iconBg ?? ""} flex items-center justify-center flex-shrink-0`}
                    >
                      <StatIcon
                        className={`w-4 h-4 ${cfg.iconClass ?? ""}`}
                        style={cfg.iconStyle}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Feature image cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <Link
          to="/log"
          data-ocid="dashboard.workout.card"
          className="group block rounded-xl overflow-hidden relative h-44 shadow-md hover:shadow-primary/20 transition-shadow"
        >
          <img
            src="/assets/generated/workout-barbell.dim_600x400.jpg"
            alt="Barbell strength training"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-white font-display font-bold text-lg leading-tight">
              Strength Training
            </p>
            <p className="text-white/70 text-xs mt-0.5">Log every rep</p>
          </div>
        </Link>

        <Link
          to="/challenges"
          data-ocid="dashboard.challenges.card"
          className="group block rounded-xl overflow-hidden relative h-44 shadow-md transition-shadow"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.05 35) 0%, oklch(0.13 0.04 25) 100%)",
            border: "1px solid oklch(0.6 0.22 40 / 0.4)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 70% 30%, oklch(0.65 0.25 40 / 0.18) 0%, transparent 70%)",
            }}
          />
          <div className="relative p-4 h-full flex flex-col justify-between">
            <div className="text-4xl">🔥</div>
            <div>
              <p
                className="font-display font-bold text-lg leading-tight"
                style={{ color: "oklch(0.9 0.12 45)" }}
              >
                Streaks & Challenges
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.6 0.1 40)" }}
              >
                Earn XP &amp; badges
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">
            Recent Sessions
          </h2>
          <Link to="/history" data-ocid="nav.history.link">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {sessionsLoading ? (
          <div
            className="flex flex-col gap-3"
            data-ocid="dashboard.sessions.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentSessions.map((session, i) => (
              <motion.div
                key={`${session.date}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
              >
                <Card className="card-elevated hover:border-primary/40 transition-all cursor-pointer">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {formatDate(session.date)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.exercises.length} exercises
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-muted-foreground">
                            Weight lifted
                          </p>
                          <p className="text-sm font-semibold">
                            {calcSessionWeight(
                              session.exercises,
                            ).toLocaleString()}{" "}
                            kg
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-destructive/10 text-destructive border-destructive/20"
                        >
                          <Flame className="w-3 h-3 mr-1" />
                          {Math.round(session.totalCalories)} kcal
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!sessionsLoading && recentSessions.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="dashboard.sessions.empty_state"
          >
            <Dumbbell
              className="w-12 h-12 mx-auto mb-4 opacity-30"
              strokeWidth={1}
            />
            <p className="font-medium">No workouts yet</p>
            <p className="text-sm mt-1">
              Log your first workout to see it here
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
