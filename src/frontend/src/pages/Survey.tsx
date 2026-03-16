import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Section = {
  title: string;
  questions: Question[];
};

type Question = {
  id: number;
  text: string;
  options: string[];
};

const sections: Section[] = [
  {
    title: "Section 1: Personal Fitness Habits",
    questions: [
      {
        id: 1,
        text: "How long have you been going to the gym?",
        options: [
          "Less than 6 months",
          "6 months – 1 year",
          "1–3 years",
          "More than 3 years",
        ],
      },
      {
        id: 2,
        text: "How many days per week do you work out?",
        options: ["1–2", "3–4", "5–6"],
      },
      {
        id: 3,
        text: "What is your primary fitness goal?",
        options: [
          "Weight loss",
          "Muscle gain",
          "General fitness",
          "Strength",
          "Endurance",
        ],
      },
    ],
  },
  {
    title: "Section 2: Workout Planning & Logging",
    questions: [
      {
        id: 4,
        text: "Do you follow a workout plan?",
        options: ["Yes (trainer-made)", "Yes (self-made)", "No"],
      },
      {
        id: 5,
        text: "Do you record your workouts?",
        options: ["Yes", "Sometimes", "No"],
      },
      {
        id: 6,
        text: "What do you use to track workouts?",
        options: ["Mobile app", "Notebook", "Memory only", "I don't track"],
      },
      {
        id: 7,
        text: "Would you like an app to log exercises, sets, reps, and weights?",
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: 8,
        text: "How important is workout history (past workouts)?",
        options: ["Very important", "Important", "Not important"],
      },
    ],
  },
  {
    title: "Section 3: Calories & Nutrition",
    questions: [
      {
        id: 9,
        text: "Do you track calories burned during workouts?",
        options: ["Yes", "Sometimes", "No"],
      },
      {
        id: 10,
        text: "Do you track daily calorie or food intake?",
        options: ["Yes", "Sometimes", "No"],
      },
      {
        id: 11,
        text: "Would you use an app that tracks both calories burned and calories intake?",
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: 12,
        text: "What nutrition feature would you prefer?",
        options: [
          "Daily calorie goal",
          "Food logging",
          "Protein/macros tracking",
          "None",
        ],
      },
    ],
  },
  {
    title: "Section 4: Progress Tracking",
    questions: [
      {
        id: 13,
        text: "Do you like seeing progress in charts or graphs?",
        options: ["Yes", "Sometimes", "No"],
      },
      {
        id: 14,
        text: "What progress matters most to you?",
        options: [
          "Weight change",
          "Strength improvement",
          "Calories burned",
          "Workout consistency",
        ],
      },
      {
        id: 15,
        text: "How often do you check your fitness progress?",
        options: ["Daily", "Weekly", "Monthly"],
      },
    ],
  },
  {
    title: "Section 5: AI & Smart Features",
    questions: [
      {
        id: 16,
        text: "Would you trust AI-based workout suggestions?",
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: 17,
        text: "What should AI workouts be based on?",
        options: [
          "Fitness goals",
          "Workout history",
          "Available time",
          "All of the above",
        ],
      },
      {
        id: 18,
        text: "How often would you want new workout suggestions?",
        options: ["Daily", "Weekly", "On request"],
      },
    ],
  },
  {
    title: "Section 6: App Experience",
    questions: [
      {
        id: 19,
        text: "What is more important in a fitness app?",
        options: [
          "Easy to use",
          "Accurate tracking",
          "Smart suggestions",
          "Visual progress",
        ],
      },
      {
        id: 20,
        text: "Would you use a fitness logger app that saves history and shows progress?",
        options: ["Yes", "Maybe", "No"],
      },
    ],
  },
  {
    title: "Section 7: Business Overview & Design Thinking",
    questions: [
      {
        id: 21,
        text: "What problem do you face with current fitness apps or tracking methods?",
        options: [
          "Too complicated to use",
          "Not accurate",
          "Too time-consuming",
          "No AI guidance",
          "I don't use any app",
        ],
      },
      {
        id: 22,
        text: "Would you pay for a fitness app that solves these problems effectively?",
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: 23,
        text: "Which pricing model do you prefer?",
        options: [
          "Free with basic features",
          "Freemium (free + paid premium)",
          "One-time payment",
          "Monthly subscription",
        ],
      },
      {
        id: 24,
        text: "What would motivate you to keep using a fitness app long-term?",
        options: [
          "Clear results/progress",
          "Personalized workouts",
          "Ease of use",
          "Rewards or streaks",
        ],
      },
      {
        id: 25,
        text: "How likely are you to recommend a good fitness app to others?",
        options: ["Very likely", "Likely", "Not likely"],
      },
      {
        id: 26,
        text: "What type of user best describes you?",
        options: ["Beginner", "Intermediate", "Advanced"],
      },
    ],
  },
];

const TOTAL_QUESTIONS = 26;

export default function Survey() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            data-ocid="survey.success_state"
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 glow-lime">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-gradient-lime mb-3">
              Thanks for Your Feedback!
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              Your responses help us build a better fitness app tailored to real
              gym users like you.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-gradient-lime">
                  Gym Survey
                </h1>
              </div>
              <p className="text-muted-foreground">
                Help us understand your fitness habits and preferences. All 26
                questions must be answered before submission.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{
                      width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%`,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium tabular-nums">
                  {answeredCount}/{TOTAL_QUESTIONS}
                </span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section, sIdx) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.05, duration: 0.35 }}
                >
                  <Card className="card-elevated">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-display text-base text-primary">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.questions.map((q) => (
                        <div key={q.id} className="space-y-3">
                          <p className="text-sm font-medium text-foreground">
                            <span className="text-primary font-bold mr-1.5">
                              {q.id}.
                            </span>
                            {q.text}
                          </p>
                          <RadioGroup
                            data-ocid={`survey.q${q.id}.radio`}
                            value={answers[q.id] ?? ""}
                            onValueChange={(val) =>
                              setAnswers((prev) => ({ ...prev, [q.id]: val }))
                            }
                            className="space-y-1.5"
                          >
                            {q.options.map((opt) => (
                              <div
                                key={opt}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all cursor-pointer",
                                  answers[q.id] === opt
                                    ? "border-primary/50 bg-primary/8"
                                    : "border-border bg-secondary/40 hover:border-primary/30 hover:bg-secondary/70",
                                )}
                              >
                                <RadioGroupItem
                                  value={opt}
                                  id={`q${q.id}-${opt}`}
                                  className="shrink-0"
                                />
                                <Label
                                  htmlFor={`q${q.id}-${opt}`}
                                  className="text-sm cursor-pointer text-foreground/90 select-none"
                                >
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Submit */}
            <div className="mt-8 flex flex-col items-center gap-3">
              {!allAnswered && (
                <p className="text-xs text-muted-foreground">
                  {TOTAL_QUESTIONS - answeredCount} question
                  {TOTAL_QUESTIONS - answeredCount !== 1 ? "s" : ""} remaining
                </p>
              )}
              <Button
                data-ocid="survey.submit_button"
                size="lg"
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="w-full max-w-sm font-semibold"
              >
                Submit Survey
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
