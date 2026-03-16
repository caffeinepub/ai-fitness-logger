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
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Loader2, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Gender, WorkoutGoal } from "../backend.d";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";

export default function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const { mutateAsync: saveProfile, isPending } = useSaveProfile();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.male);
  const [goal, setGoal] = useState<WorkoutGoal>(WorkoutGoal.generalHealth);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(String(Number(profile.age)));
      setWeight(String(profile.weight));
      setGender(profile.gender);
      setGoal(profile.fitnessGoal);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    const ageNum = Number.parseInt(age);
    const weightNum = Number.parseFloat(weight);
    if (!ageNum || ageNum < 10 || ageNum > 120) {
      toast.error("Enter a valid age");
      return;
    }
    if (!weightNum || weightNum < 20 || weightNum > 300) {
      toast.error("Enter a valid weight");
      return;
    }

    try {
      await saveProfile({
        name: name.trim(),
        age: BigInt(ageNum),
        weight: weightNum,
        gender,
        fitnessGoal: goal,
      });
      setSaved(true);
      toast.success("Profile saved!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const goalLabels: Record<WorkoutGoal, string> = {
    [WorkoutGoal.weightLoss]: "Weight Loss",
    [WorkoutGoal.muscleGain]: "Muscle Gain",
    [WorkoutGoal.generalHealth]: "General Health",
    [WorkoutGoal.endurance]: "Endurance",
  };

  const genderLabels: Record<Gender, string> = {
    [Gender.male]: "Male",
    [Gender.female]: "Female",
    [Gender.other]: "Other",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Your details improve calorie accuracy
            </p>
          </div>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {isLoading ? (
              <div
                className="flex flex-col gap-4"
                data-ocid="profile.loading_state"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    data-ocid="profile.name.input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="profile-age">Age</Label>
                    <Input
                      id="profile-age"
                      type="number"
                      min="10"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="28"
                      data-ocid="profile.age.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="profile-weight">Weight (kg)</Label>
                    <Input
                      id="profile-weight"
                      type="number"
                      min="20"
                      max="300"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="75"
                      data-ocid="profile.weight.input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Gender</Label>
                  <Select
                    value={gender}
                    onValueChange={(v) => setGender(v as Gender)}
                  >
                    <SelectTrigger data-ocid="profile.gender.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Gender).map((g) => (
                        <SelectItem key={g} value={g}>
                          {genderLabels[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Fitness Goal</Label>
                  <Select
                    value={goal}
                    onValueChange={(v) => setGoal(v as WorkoutGoal)}
                  >
                    <SelectTrigger data-ocid="profile.goal.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(WorkoutGoal).map((g) => (
                        <SelectItem key={g} value={g}>
                          {goalLabels[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isPending}
                  className="w-full h-11 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                  data-ocid="profile.save.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" /> Saved!
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
