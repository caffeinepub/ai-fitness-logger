import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Lightbulb,
  Link as LinkIcon,
  Shuffle,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useWorkoutSessions } from "../hooks/useQueries";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: "base" | "progressive" | "variety";
  exercises: string[];
  icon: typeof Lightbulb;
}

const FULL_BODY_ROUTINE = [
  "Squat",
  "Deadlift",
  "Bench Press",
  "Barbell Row",
  "Overhead Press",
];

const ALL_EXERCISES = [
  "Squat",
  "Deadlift",
  "Bench Press",
  "Overhead Press",
  "Barbell Row",
  "Pull-Up",
  "Dumbbell Curl",
  "Tricep Pushdown",
  "Leg Press",
  "Lat Pulldown",
];

export default function Suggestions() {
  const { data: sessions, isLoading } = useWorkoutSessions();

  const suggestions: Suggestion[] = useMemo(() => {
    if (!sessions) return [];

    const result: Suggestion[] = [];

    // Case 1: < 3 sessions — build base
    if (sessions.length < 3) {
      result.push({
        id: "build-base",
        title: "Build Your Base",
        description:
          "You're just getting started! A balanced full-body routine will build a strong foundation. Hit these compound movements 3x per week.",
        type: "base",
        exercises: FULL_BODY_ROUTINE,
        icon: Zap,
      });
      return result;
    }

    const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
    const recent3 = sorted.slice(0, 3);

    // Case 2: progressive overload suggestions
    const exerciseCounts: Record<
      string,
      { sessions: number; maxWeight: number }
    > = {};
    for (const session of recent3) {
      const names = new Set(session.exercises.map((e) => e.name));
      for (const name of names) {
        if (!exerciseCounts[name])
          exerciseCounts[name] = { sessions: 0, maxWeight: 0 };
        exerciseCounts[name].sessions++;
        const maxW = Math.max(
          ...session.exercises
            .filter((e) => e.name === name)
            .map((e) => e.weight),
        );
        exerciseCounts[name].maxWeight = Math.max(
          exerciseCounts[name].maxWeight,
          maxW,
        );
      }
    }

    for (const [name, data] of Object.entries(exerciseCounts)) {
      if (data.sessions >= 3) {
        const newWeight = Math.round(data.maxWeight * 1.05 * 2) / 2;
        result.push({
          id: `progressive-${name}`,
          title: `Progressive Overload: ${name}`,
          description: `You've done ${name} in ${data.sessions} consecutive sessions. Increase the weight by 5% for progressive overload. Aim for ${newWeight}kg next session.`,
          type: "progressive",
          exercises: [name],
          icon: TrendingUp,
        });
      }
    }

    // Case 3: variety — exercises not in recent 3 sessions
    const recentExerciseNames = new Set(
      recent3.flatMap((s) => s.exercises.map((e) => e.name)),
    );
    const notRecent = ALL_EXERCISES.filter((e) => !recentExerciseNames.has(e));
    if (notRecent.length > 0) {
      result.push({
        id: "variety",
        title: "Add Some Variety",
        description:
          "You haven't trained these muscles recently. Adding variety prevents plateaus and ensures balanced development.",
        type: "variety",
        exercises: notRecent.slice(0, 4),
        icon: Shuffle,
      });
    }

    // Fallback
    if (result.length === 0) {
      result.push({
        id: "great-work",
        title: "Keep Up the Great Work!",
        description:
          "Your training is well-balanced. Continue your current routine and focus on progressive overload each week.",
        type: "base",
        exercises: ["Squat", "Bench Press", "Deadlift"],
        icon: Lightbulb,
      });
    }

    return result;
  }, [sessions]);

  const typeColors: Record<Suggestion["type"], string> = {
    base: "bg-primary/10 text-primary border-primary/20",
    progressive: "bg-accent/10 text-accent border-accent/20",
    variety: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  };

  const typeLabels: Record<Suggestion["type"], string> = {
    base: "Foundation",
    progressive: "Progressive Overload",
    variety: "Variety",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">AI Suggestions</h1>
            <p className="text-muted-foreground">
              Personalized workout recommendations
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div
          className="flex flex-col gap-4"
          data-ocid="suggestions.loading_state"
        >
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {suggestions.map((sug, idx) => (
            <motion.div
              key={sug.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              data-ocid={`suggestions.item.${idx + 1}`}
            >
              <Card className="card-elevated hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <sug.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {sug.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-xs mt-1.5 ${typeColors[sug.type]}`}
                        >
                          {typeLabels[sug.type]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {sug.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sug.exercises.map((ex) => (
                      <Badge key={ex} variant="secondary" className="text-xs">
                        {ex}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link to="/log">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-primary/30 text-primary hover:bg-primary/10 text-xs"
                      >
                        <LinkIcon className="w-3 h-3" /> Log this workout
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
