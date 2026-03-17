import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Beef,
  Lightbulb,
  Link as LinkIcon,
  Shuffle,
  TrendingUp,
  UserCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { WorkoutGoal } from "../backend.d";
import { useUserProfile, useWorkoutSessions } from "../hooks/useQueries";

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

const GOAL_MULTIPLIERS: Record<WorkoutGoal, number> = {
  [WorkoutGoal.muscleGain]: 1.6,
  [WorkoutGoal.endurance]: 1.2,
  [WorkoutGoal.weightLoss]: 1.0,
  [WorkoutGoal.generalHealth]: 0.8,
};

const GOAL_POST_WORKOUT: Record<WorkoutGoal, number> = {
  [WorkoutGoal.muscleGain]: 40,
  [WorkoutGoal.endurance]: 30,
  [WorkoutGoal.weightLoss]: 25,
  [WorkoutGoal.generalHealth]: 25,
};

const GOAL_LABELS: Record<WorkoutGoal, string> = {
  [WorkoutGoal.muscleGain]: "Muscle Gain",
  [WorkoutGoal.endurance]: "Endurance",
  [WorkoutGoal.weightLoss]: "Weight Loss",
  [WorkoutGoal.generalHealth]: "General Health",
};

const GOAL_DESCRIPTIONS: Record<WorkoutGoal, string> = {
  [WorkoutGoal.muscleGain]:
    "Higher protein intake supports muscle repair and hypertrophy after intense lifting sessions. The workout bonus accounts for extra muscle breakdown during training.",
  [WorkoutGoal.endurance]:
    "Moderate protein supports muscle maintenance and recovery from sustained cardio and endurance training. Your workout bonus reflects additional recovery needs.",
  [WorkoutGoal.weightLoss]:
    "Adequate protein preserves lean muscle while in a caloric deficit. Staying protein-sufficient prevents muscle loss and keeps metabolism high.",
  [WorkoutGoal.generalHealth]:
    "A balanced protein intake supports overall health, immune function, and tissue repair. Your workout activity adds a small bonus to cover active recovery.",
};

function ProteinCard({
  profile,
  sessions,
}: {
  profile: { weight: number; fitnessGoal: WorkoutGoal } | null | undefined;
  sessions: { totalCalories: number }[] | undefined;
}) {
  const proteinData = useMemo(() => {
    if (!profile) return null;

    const multiplier = GOAL_MULTIPLIERS[profile.fitnessGoal];
    const baseProtein = profile.weight * multiplier;

    const recent = sessions?.slice(0, 3) ?? [];
    const avgCalories =
      recent.length > 0
        ? recent.reduce((sum, s) => sum + s.totalCalories, 0) / recent.length
        : 0;
    const workoutBonus = avgCalories * 0.05;
    const totalProtein = Math.round(baseProtein + workoutBonus);
    const perMeal = Math.round(totalProtein / 3);
    const postWorkout = GOAL_POST_WORKOUT[profile.fitnessGoal];
    const bonusPct = totalProtein > 0 ? (workoutBonus / totalProtein) * 100 : 0;

    return {
      baseProtein: Math.round(baseProtein),
      workoutBonus: Math.round(workoutBonus),
      totalProtein,
      perMeal,
      postWorkout,
      bonusPct,
      goal: profile.fitnessGoal,
    };
  }, [profile, sessions]);

  if (!profile) {
    return (
      <Card
        className="border-dashed border-border"
        data-ocid="suggestions.protein.empty_state"
      >
        <CardContent className="flex items-center gap-4 py-6">
          <div className="w-10 h-10 rounded-xl bg-chart-2/10 border border-chart-2/20 flex items-center justify-center flex-shrink-0">
            <UserCircle className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <p className="font-semibold text-sm">Set Up Your Profile</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set up your profile to get personalized AI protein intake
              recommendations based on your goals and workouts.
            </p>
          </div>
          <Link to="/profile" className="ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-2 border-chart-2/30 text-chart-2 hover:bg-chart-2/10 whitespace-nowrap"
            >
              Go to Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!proteinData) return null;

  return (
    <Card
      className="border-chart-2/20 bg-chart-2/5"
      data-ocid="suggestions.protein.card"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-chart-2/10 border border-chart-2/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Beef className="w-4 h-4 text-chart-2" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">
                AI Protein Intake
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20"
              >
                {GOAL_LABELS[proteinData.goal]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personalized daily protein goal
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Big number */}
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold text-chart-2 leading-none">
            {proteinData.totalProtein}
          </span>
          <span className="text-lg text-muted-foreground mb-1">g / day</span>
        </div>

        {/* Breakdown bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Base protein{" "}
              <strong className="text-foreground">
                {proteinData.baseProtein}g
              </strong>
            </span>
            <span>
              Workout bonus{" "}
              <strong className="text-chart-2">
                {proteinData.workoutBonus > 0
                  ? `+${proteinData.workoutBonus}g`
                  : "0g"}
              </strong>
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-chart-2/60 transition-all duration-700"
                style={{ width: `${100 - proteinData.bonusPct}%` }}
              />
              {proteinData.workoutBonus > 0 && (
                <div
                  className="bg-chart-2 transition-all duration-700"
                  style={{ width: `${proteinData.bonusPct}%` }}
                />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {proteinData.workoutBonus > 0
              ? `Based on avg ${Math.round(proteinData.workoutBonus / 0.05)} kcal burned per session`
              : "Log workouts to unlock your calorie-based workout bonus"}
          </p>
        </div>

        {/* Meal breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-background/60 border border-border p-3">
            <p className="text-xs text-muted-foreground">Per meal</p>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {proteinData.perMeal}
              <span className="text-sm font-normal text-muted-foreground">
                g
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              ~{proteinData.perMeal}g × 3 meals
            </p>
          </div>
          <div className="rounded-lg bg-chart-2/10 border border-chart-2/20 p-3">
            <p className="text-xs text-muted-foreground">Post-workout</p>
            <p className="text-xl font-bold text-chart-2 mt-0.5">
              {proteinData.postWorkout}
              <span className="text-sm font-normal text-muted-foreground">
                g
              </span>
            </p>
            <p className="text-xs text-muted-foreground">Within 30–60 min</p>
          </div>
        </div>

        {/* AI description */}
        <div className="rounded-lg bg-background/60 border border-border p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">
              Why this amount?{" "}
            </span>
            {GOAL_DESCRIPTIONS[proteinData.goal]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Suggestions() {
  const { data: sessions, isLoading: sessionsLoading } = useWorkoutSessions();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const isLoading = sessionsLoading || profileLoading;

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
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* AI Protein Intake Card — above suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <ProteinCard profile={profile} sessions={sessions} />
          </motion.div>

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
