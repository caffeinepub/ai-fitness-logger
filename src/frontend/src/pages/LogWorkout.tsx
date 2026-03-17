import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Flame, Loader2, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ExerciseLog } from "../backend.d";
import SubscriptionModal from "../components/SubscriptionModal";
import { useSubscription } from "../context/SubscriptionContext";
import { useLogWorkout } from "../hooks/useQueries";
import { useUserProfile } from "../hooks/useQueries";

const PRESET_EXERCISES: { name: string; met: number }[] = [
  { name: "Squat", met: 5.0 },
  { name: "Deadlift", met: 6.0 },
  { name: "Bench Press", met: 5.0 },
  { name: "Overhead Press", met: 4.5 },
  { name: "Barbell Row", met: 5.0 },
  { name: "Pull-Up", met: 5.5 },
  { name: "Dumbbell Curl", met: 3.5 },
  { name: "Tricep Pushdown", met: 3.5 },
  { name: "Leg Press", met: 4.0 },
  { name: "Lat Pulldown", met: 4.0 },
  { name: "Custom", met: 4.0 },
];

interface ExerciseRow {
  id: number;
  name: string;
  customName: string;
  sets: string;
  reps: string;
  weight: string;
}

const DEFAULT_USER_WEIGHT = 75;

export default function LogWorkout() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    {
      id: 1,
      name: "Squat",
      customName: "",
      sets: "4",
      reps: "8",
      weight: "80",
    },
  ]);
  const [nextId, setNextId] = useState(2);
  const [showPaywall, setShowPaywall] = useState(false);
  const { mutateAsync: logWorkout, isPending } = useLogWorkout();
  const { data: profile } = useUserProfile();
  const { canLog, incrementTrial } = useSubscription();
  const navigate = useNavigate();

  const userWeight = profile?.weight ?? DEFAULT_USER_WEIGHT;

  const calcCalories = (ex: ExerciseRow) => {
    const preset = PRESET_EXERCISES.find((p) => p.name === ex.name);
    const met = preset ? preset.met : 4.0;
    const sets = Number.parseFloat(ex.sets) || 0;
    const reps = Number.parseFloat(ex.reps) || 0;
    return met * userWeight * sets * reps * 0.05;
  };

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: nextId,
        name: "Squat",
        customName: "",
        sets: "3",
        reps: "8",
        weight: "60",
      },
    ]);
    setNextId((n) => n + 1);
  };

  const removeExercise = (id: number) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExercise = (
    id: number,
    field: keyof ExerciseRow,
    value: string,
  ) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  const totalCalories = exercises.reduce((sum, e) => sum + calcCalories(e), 0);

  const handleSubmit = async () => {
    if (exercises.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }

    if (!canLog) {
      setShowPaywall(true);
      return;
    }

    const exerciseLogs: ExerciseLog[] = exercises.map((e) => {
      const preset = PRESET_EXERCISES.find((p) => p.name === e.name);
      const met = preset ? preset.met : 4.0;
      const name =
        e.name === "Custom" ? e.customName || "Custom Exercise" : e.name;
      const sets = Number.parseInt(e.sets) || 1;
      const reps = Number.parseInt(e.reps) || 1;
      const weight = Number.parseFloat(e.weight) || 0;
      return {
        name,
        sets: BigInt(sets),
        reps: BigInt(reps),
        weight,
        metValue: met,
        caloriesBurned: met * userWeight * sets * reps * 0.05,
      };
    });

    try {
      await logWorkout({ date, exercises: exerciseLogs });
      incrementTrial();
      toast.success("Workout logged successfully!");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to log workout. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SubscriptionModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Log Workout</h1>
          <p className="text-muted-foreground mt-1">
            Record your training session
          </p>
        </div>

        <Card className="card-elevated mb-6">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Session Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="max-w-xs"
              data-ocid="log.date.input"
            />
          </CardContent>
        </Card>

        <Card className="card-elevated mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Exercises</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={addExercise}
              className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
              data-ocid="log.add_exercise.button"
            >
              <Plus className="w-4 h-4" /> Add Exercise
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <AnimatePresence initial={false}>
              {exercises.map((ex, idx) => {
                const calories = calcCalories(ex);
                return (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {idx > 0 && <Separator className="mb-6" />}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                            <Dumbbell className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Exercise {idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {calories > 0 && (
                            <span className="text-xs flex items-center gap-1 text-destructive">
                              <Flame className="w-3 h-3" />~
                              {Math.round(calories)} kcal
                            </span>
                          )}
                          {exercises.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExercise(ex.id)}
                              className="w-7 h-7 text-muted-foreground hover:text-destructive"
                              data-ocid="log.remove_exercise.delete_button"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs mb-1.5">Exercise</Label>
                          <Select
                            value={ex.name}
                            onValueChange={(v) =>
                              updateExercise(ex.id, "name", v)
                            }
                          >
                            <SelectTrigger data-ocid="log.exercise.select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PRESET_EXERCISES.map((p) => (
                                <SelectItem key={p.name} value={p.name}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {ex.name === "Custom" && (
                          <div>
                            <Label className="text-xs mb-1.5">
                              Custom Exercise Name
                            </Label>
                            <Input
                              value={ex.customName}
                              onChange={(e) =>
                                updateExercise(
                                  ex.id,
                                  "customName",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter exercise name"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs mb-1.5">Sets</Label>
                            <Input
                              type="number"
                              min="1"
                              value={ex.sets}
                              onChange={(e) =>
                                updateExercise(ex.id, "sets", e.target.value)
                              }
                              data-ocid="log.sets.input"
                            />
                          </div>
                          <div>
                            <Label className="text-xs mb-1.5">Reps</Label>
                            <Input
                              type="number"
                              min="1"
                              value={ex.reps}
                              onChange={(e) =>
                                updateExercise(ex.id, "reps", e.target.value)
                              }
                              data-ocid="log.reps.input"
                            />
                          </div>
                          <div>
                            <Label className="text-xs mb-1.5">
                              Weight (kg)
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              value={ex.weight}
                              onChange={(e) =>
                                updateExercise(ex.id, "weight", e.target.value)
                              }
                              data-ocid="log.weight.input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="card-elevated mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium">
                Estimated Calories Burned
              </span>
            </div>
            <span className="text-xl font-display font-bold text-destructive">
              {Math.round(totalCalories)} kcal
            </span>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-lime"
          data-ocid="log.submit.primary_button"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Workout Session"
          )}
        </Button>
      </motion.div>
    </div>
  );
}
