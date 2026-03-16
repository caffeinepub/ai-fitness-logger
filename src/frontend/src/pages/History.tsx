import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Flame, Weight } from "lucide-react";
import { motion } from "motion/react";
import { useWorkoutSessions } from "../hooks/useQueries";

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
  {
    date: "2026-03-09",
    exercises: [
      {
        name: "Squat",
        sets: BigInt(5),
        reps: BigInt(5),
        weight: 105,
        caloriesBurned: 131.25,
        metValue: 5.0,
      },
      {
        name: "Dumbbell Curl",
        sets: BigInt(3),
        reps: BigInt(12),
        weight: 20,
        caloriesBurned: 94.5,
        metValue: 3.5,
      },
      {
        name: "Tricep Pushdown",
        sets: BigInt(3),
        reps: BigInt(12),
        weight: 25,
        caloriesBurned: 94.5,
        metValue: 3.5,
      },
    ],
    totalCalories: 320.25,
  },
  {
    date: "2026-03-07",
    exercises: [
      {
        name: "Deadlift",
        sets: BigInt(4),
        reps: BigInt(5),
        weight: 125,
        caloriesBurned: 150,
        metValue: 6.0,
      },
      {
        name: "Lat Pulldown",
        sets: BigInt(4),
        reps: BigInt(10),
        weight: 65,
        caloriesBurned: 120,
        metValue: 4.0,
      },
    ],
    totalCalories: 270,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
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

export default function History() {
  const { data: sessions, isLoading } = useWorkoutSessions();
  const displaySessions =
    sessions && sessions.length > 0 ? sessions : SAMPLE_SESSIONS;
  const sorted = [...displaySessions].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold">Workout History</h1>
        <p className="text-muted-foreground mt-1">
          {sorted.length} sessions recorded
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col gap-4" data-ocid="history.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="history.empty_state"
        >
          <Calendar
            className="w-12 h-12 mx-auto mb-4 opacity-30"
            strokeWidth={1}
          />
          <p className="font-medium">No sessions yet</p>
          <p className="text-sm mt-1">Your logged workouts will appear here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((session, idx) => {
            const totalWeight = calcSessionWeight(session.exercises);
            const ocid = `history.session.item.${idx + 1}`;
            return (
              <motion.div
                key={`${session.date}-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={ocid}
              >
                <Card className="card-elevated hover:border-primary/30 transition-all">
                  <CardContent className="py-5 px-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <p className="font-display font-semibold">
                          {formatDate(session.date)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {session.exercises.length} exercises
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-secondary/80">
                          <Weight className="w-3 h-3 mr-1" />
                          {totalWeight.toLocaleString()} kg
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-destructive/10 text-destructive border-destructive/20"
                        >
                          <Flame className="w-3 h-3 mr-1" />
                          {Math.round(session.totalCalories)} kcal
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {session.exercises.map((ex) => (
                        <div
                          key={`${ex.name}-${Number(ex.sets)}-${Number(ex.reps)}`}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="font-medium min-w-[140px]">
                            {ex.name}
                          </span>
                          <span className="text-muted-foreground">
                            {Number(ex.sets)} × {Number(ex.reps)}
                            {ex.weight > 0 ? ` @ ${ex.weight}kg` : ""}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {Math.round(ex.caloriesBurned)} kcal
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
