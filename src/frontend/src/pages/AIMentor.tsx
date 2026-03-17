import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WorkoutGoal } from "../backend.d";
import { useUserProfile, useWorkoutSessions } from "../hooks/useQueries";

interface Message {
  id: string;
  role: "mentor" | "user";
  text: string;
  timestamp: Date;
}

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

const QUICK_QUESTIONS = [
  "How am I progressing?",
  "What should I train today?",
  "How much protein do I need?",
  "Am I overtraining?",
  "Give me motivation",
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

type SessionData = {
  date: string;
  exercises: { name: string; weight: number; sets: bigint; reps: bigint }[];
  totalCalories: number;
};

type ProfileData = {
  weight: number;
  fitnessGoal: WorkoutGoal;
  name: string;
} | null;

function generateResponse(
  text: string,
  sessions: SessionData[] | undefined,
  profile: ProfileData,
): string {
  const lower = text.toLowerCase();
  const hasProfile = !!profile;
  const sessionCount = sessions?.length ?? 0;

  const profileReminder = !hasProfile
    ? " (Set up your profile for even more personalized advice!)"
    : "";

  // Progressing / progress
  if (lower.includes("progress")) {
    if (sessionCount === 0) {
      return "You haven't logged any workouts yet — that's totally fine! Every champion starts with zero sessions. Log your first workout and I'll start tracking your progress. 💪";
    }
    const totalWeight = sessions!.reduce(
      (sum, s) =>
        sum +
        s.exercises.reduce(
          (es, e) => es + e.weight * Number(e.sets) * Number(e.reps),
          0,
        ),
      0,
    );
    const totalCals = sessions!.reduce((sum, s) => sum + s.totalCalories, 0);
    const sorted = [...sessions!].sort((a, b) => b.date.localeCompare(a.date));
    const lastDate = sorted[0]?.date ?? "N/A";
    return `Here's your progress snapshot:\n\n📊 **${sessionCount} sessions** logged\n🏋️ **${Math.round(totalWeight).toLocaleString()} kg** total volume lifted\n🔥 **${Math.round(totalCals)} kcal** burned across all sessions\n📅 Last workout: **${lastDate}**\n\n${sessionCount >= 5 ? "You're building real consistency — that's the #1 driver of results!" : "Keep building momentum, each session counts!"}${profileReminder}`;
  }

  // Train today / what should
  if (lower.includes("train today") || lower.includes("what should")) {
    if (sessionCount === 0) {
      return `Let's get you started! Since you're new, I recommend a full-body session:\n\n💪 Squat — 3×8\n🏋️ Bench Press — 3×8\n🔁 Barbell Row — 3×8\n⬆️ Overhead Press — 3×8\n\nFocus on form over weight. See you on the other side!${profileReminder}`;
    }
    const sorted = [...sessions!].sort((a, b) => b.date.localeCompare(a.date));
    const recent = sorted.slice(0, 3);
    const recentExercises = new Set(
      recent.flatMap((s) => s.exercises.map((e) => e.name)),
    );
    const suggestions = ALL_EXERCISES.filter(
      (e) => !recentExercises.has(e),
    ).slice(0, 4);
    const lastDate = sorted[0]?.date;
    const daysSince = lastDate
      ? Math.floor(
          (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24),
        )
      : 999;

    if (daysSince === 0) {
      return "You already trained today — great dedication! Rest is where muscles actually grow. Take the day off, eat protein, and sleep well. Come back tomorrow ready to crush it! 😴";
    }

    if (suggestions.length > 0) {
      return `Based on your recent sessions, here are muscles you haven't hit lately:\n\n${suggestions.map((e) => `💪 ${e}`).join("\n")}\n\nFocus on these today for balanced development. ${daysSince >= 3 ? "You've had good rest, so push hard!" : "Keep the intensity moderate since you trained recently."}${profileReminder}`;
    }

    return `You've been hitting all the major muscle groups — excellent balance! For today, focus on progressive overload: add 2.5–5kg to your main lifts from last session.${profileReminder}`;
  }

  // Protein
  if (lower.includes("protein")) {
    if (!profile) {
      return "To calculate your exact protein needs, I need your profile data. Head over to the Profile page and enter your weight, age, and fitness goal — then come back and I'll give you precise daily targets! 🥩";
    }
    const multiplier = GOAL_MULTIPLIERS[profile.fitnessGoal];
    const baseProtein = profile.weight * multiplier;
    const recent = sessions?.slice(0, 3) ?? [];
    const avgCalories =
      recent.length > 0
        ? recent.reduce((sum, s) => sum + s.totalCalories, 0) / recent.length
        : 0;
    const workoutBonus = Math.round(avgCalories * 0.05);
    const total = Math.round(baseProtein + workoutBonus);
    const postWorkout = GOAL_POST_WORKOUT[profile.fitnessGoal];
    return `Here's your personalized protein plan:\n\n🥩 **Daily target: ${total}g**\n📐 Base (${profile.weight}kg × ${multiplier}): ${Math.round(baseProtein)}g\n⚡ Workout bonus: +${workoutBonus}g\n\n🍽️ Per meal (~3 meals): **${Math.round(total / 3)}g**\n🏋️ Post-workout window: **${postWorkout}g** within 30–60 min\n\nHit these targets consistently and your body will respond!`;
  }

  // Overtraining / rest
  if (lower.includes("overtrain") || lower.includes("rest")) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sessionsThisWeek =
      sessions?.filter((s) => new Date(s.date) >= weekAgo).length ?? 0;
    if (sessionsThisWeek > 5) {
      return `⚠️ **Heads up!** You've logged **${sessionsThisWeek} sessions** in the last 7 days — that's a high volume.\n\nOvertraining signs to watch for:\n• Persistent fatigue or soreness\n• Declining performance\n• Poor sleep\n• Mood changes\n\nI'd recommend scheduling **1–2 full rest days** this week. Recovery is where gains are made!`;
    }
    if (sessionsThisWeek === 0) {
      return `You haven't trained this week yet — a little rest is fine, but let's not lose momentum! Aim for 3–4 sessions this week. Even a 20-minute session counts. You've got this! 💪`;
    }
    return `You've done **${sessionsThisWeek} sessions** this week — that's a healthy training frequency! You're not overtraining. Keep 1–2 rest days between intense sessions and prioritize 7–9 hours of sleep for optimal recovery. 😎`;
  }

  // Motivation
  if (lower.includes("motiv")) {
    const motivations = [
      sessionCount > 10
        ? `You've already logged **${sessionCount} workouts** — that's not luck, that's commitment. Every single rep you've done has built the person you are right now. Keep going. 🔥`
        : "Every expert was once a beginner. The only workout you'll ever regret is the one you skipped. Today's effort is tomorrow's strength. Let's go! 💪",
      `"The pain you feel today will be the strength you feel tomorrow." — You're not just lifting weights, you're lifting your whole life. Keep showing up! 🏆`,
      "Progress isn't always visible on the scale or in the mirror — sometimes it lives in your discipline, your consistency, and your refusal to quit. You're building something real. 🌟",
    ];
    const msg = motivations[sessionCount % motivations.length];
    return `${msg}${sessionCount > 0 ? `\n\n📊 Remember: ${sessionCount} sessions logged and counting!` : ""}`;
  }

  // General fallback
  if (sessionCount === 0) {
    return `Hey there! I'm Coach AI, your personal fitness mentor. I'm here to help you crush your goals! 🏋️\n\nStart by logging your first workout — it takes just 2 minutes. Once you have some data, I can give you insights on progress, training plans, protein targets, and recovery. Ready to begin?${profileReminder}`;
  }

  return `Great question! Here's some general advice based on your ${sessionCount} sessions logged:\n\n✅ Aim for **3–5 sessions/week** for optimal progress\n✅ Focus on **progressive overload** — add weight gradually\n✅ **Sleep 7–9 hours** — this is when muscle is built\n✅ **Track your nutrition** — protein is key for recovery\n\nAsk me anything specific — progress, training plans, protein needs, or motivation! I'm here for you. 💪${profileReminder}`;
}

function renderText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={`bold-${i}`}>{part.slice(2, -2)}</strong>);
    } else {
      const lines = part.split("\n");
      for (let j = 0; j < lines.length; j++) {
        if (j > 0) nodes.push(<br key={`br-${i}-${j}`} />);
        if (lines[j]) nodes.push(<span key={`txt-${i}-${j}`}>{lines[j]}</span>);
      }
    }
  }
  return nodes;
}

export default function AIMentor() {
  const { data: sessions } = useWorkoutSessions();
  const { data: profile } = useUserProfile();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgCount = messages.length;

  // Welcome message on mount
  useEffect(() => {
    const welcome: Message = {
      id: "welcome",
      role: "mentor",
      text: "Hey there! I'm **Coach AI**, your personal fitness mentor. 🏋️\n\nI can analyze your workouts, guide your training, calculate your protein needs, and keep you motivated. What's on your mind today?",
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, []);

  // Auto-scroll to bottom when messages change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll on msgCount and isTyping changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgCount, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowQuickQuestions(false);

    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      const profileData = profile
        ? {
            weight: profile.weight,
            fitnessGoal: profile.fitnessGoal,
            name: profile.name,
          }
        : null;
      const responseText = generateResponse(text, sessions, profileData);
      const mentorMsg: Message = {
        id: `mentor-${Date.now()}`,
        role: "mentor",
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mentorMsg]);
      setIsTyping(false);
      setShowQuickQuestions(true);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-1px)] max-h-[900px] container mx-auto px-0 sm:px-4 py-0 sm:py-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-0 pt-4 sm:pt-0 pb-4 flex items-center gap-3 flex-shrink-0"
      >
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-gradient-lime leading-tight">
            Coach AI
          </h1>
          <p className="text-xs text-muted-foreground">
            Your personal fitness mentor · Always online
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-xs text-primary font-medium">AI-Powered</span>
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card/40 backdrop-blur-sm flex flex-col mx-4 sm:mx-0">
        <ScrollArea className="flex-1" ref={scrollRef as any}>
          <div className="p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  data-ocid={`mentor.message.item.${idx + 1}`}
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mt-0.5">
                    {msg.role === "mentor" ? (
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-secondary border border-border flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "mentor"
                        ? "bg-secondary border border-border text-foreground rounded-tl-sm"
                        : "bg-primary/15 border border-primary/25 text-foreground rounded-tr-sm",
                    )}
                  >
                    {renderText(msg.text)}
                    <p className="text-[10px] text-muted-foreground mt-1.5 opacity-70">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex gap-2.5"
                  data-ocid="mentor.loading_state"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/60"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick questions */}
            <AnimatePresence>
              {showQuickQuestions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {QUICK_QUESTIONS.map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => sendMessage(q)}
                      data-ocid={`mentor.quick_question.button.${i + 1}`}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary hover:bg-primary/15 hover:border-primary/40 transition-all cursor-pointer"
                    >
                      {q}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {messages.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="mentor.empty_state"
              >
                <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Starting conversation...
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-3 border-t border-border bg-background/60 backdrop-blur-sm flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Coach AI anything..."
              disabled={isTyping}
              data-ocid="mentor.input"
              className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 disabled:opacity-50 transition-all"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              data-ocid="mentor.send.button"
              className="w-10 h-10 rounded-xl p-0 flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground text-center mt-2 opacity-60">
            AI responses are personalized based on your workout data
          </p>
        </div>
      </div>
    </div>
  );
}
