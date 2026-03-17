import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, Star, Trophy, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { BADGES, useStreak } from "../context/StreakContext";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getLast7Days(): { date: string; label: string; isToday: boolean }[] {
  const result: { date: string; label: string; isToday: boolean }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
    result.push({ date: dateStr, label, isToday: i === 0 });
  }
  return result;
}

function xpLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

function xpToNextLevel(xp: number) {
  return 100 - (xp % 100);
}

function xpProgress(xp: number) {
  return xp % 100;
}

export default function Challenges() {
  const {
    currentStreak,
    longestStreak,
    workoutDates,
    totalXP,
    dailyChallenges,
    completedChallengeIds,
    earnedBadgeIds,
    completeChallenge,
  } = useStreak();

  const last7 = getLast7Days();
  const level = xpLevel(totalXP);
  const progress = xpProgress(totalXP);
  const toNext = xpToNextLevel(totalXP);

  const handleComplete = (id: string, title: string, xp: number) => {
    completeChallenge(id);
    toast.success(`+${xp} XP — "${title}" completed! 🎉`, {
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* ── Hero Streak Section ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden mb-8"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.04 30) 0%, oklch(0.14 0.06 25) 100%)",
          border: "1px solid oklch(0.6 0.25 35 / 0.4)",
          boxShadow:
            "0 0 60px oklch(0.6 0.25 35 / 0.15), 0 0 120px oklch(0.6 0.25 35 / 0.08)",
        }}
        data-ocid="challenges.streak.card"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 20% 50%, oklch(0.6 0.25 35 / 0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Flame + streak number */}
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center"
            >
              <div
                className="text-7xl leading-none select-none"
                style={{ filter: "drop-shadow(0 0 24px oklch(0.7 0.3 40))" }}
              >
                🔥
              </div>
              <div
                className="text-5xl font-display font-black mt-1 tabular-nums"
                style={{
                  color: "oklch(0.88 0.22 55)",
                  textShadow: "0 0 30px oklch(0.7 0.28 45 / 0.6)",
                }}
              >
                {currentStreak}
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: "oklch(0.7 0.15 45)" }}
              >
                day streak
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1
                className="text-2xl font-display font-bold mb-1"
                style={{ color: "oklch(0.95 0.05 55)" }}
              >
                {currentStreak === 0
                  ? "Start Your Streak!"
                  : currentStreak < 3
                    ? "Keep the Momentum! 💪"
                    : currentStreak < 7
                      ? "You're on Fire! 🔥"
                      : currentStreak < 30
                        ? "Unstoppable Force! ⚡"
                        : "Legendary Dedication! 🛡️"}
              </h1>
              <p
                className="text-sm mb-4"
                style={{ color: "oklch(0.65 0.08 45)" }}
              >
                {currentStreak === 0
                  ? "Log a workout today to begin your streak."
                  : `You've worked out ${currentStreak} day${currentStreak !== 1 ? "s" : ""} in a row. Don't break the chain!`}
              </p>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.6 0.25 35 / 0.15)",
                  color: "oklch(0.82 0.2 45)",
                  border: "1px solid oklch(0.6 0.25 35 / 0.3)",
                }}
              >
                <Trophy className="w-3.5 h-3.5" />
                Longest streak: {longestStreak} days
              </div>
            </div>
          </div>

          {/* 7-day heatmap */}
          <div className="mt-6">
            <p
              className="text-xs font-medium mb-3"
              style={{ color: "oklch(0.55 0.08 45)" }}
            >
              Last 7 days
            </p>
            <div className="flex gap-2">
              {last7.map(({ date, label, isToday }) => {
                const logged = workoutDates.includes(date);
                return (
                  <div
                    key={date}
                    className="flex flex-col items-center gap-1.5 flex-1"
                  >
                    <div
                      className="w-full aspect-square rounded-lg transition-all"
                      style={{
                        background: logged
                          ? "oklch(0.7 0.28 40)"
                          : "oklch(0.2 0.04 30)",
                        boxShadow: logged
                          ? "0 0 12px oklch(0.7 0.28 40 / 0.6)"
                          : "none",
                        outline: isToday
                          ? "2px solid oklch(0.7 0.28 40 / 0.6)"
                          : "none",
                        outlineOffset: "2px",
                      }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: isToday
                          ? "oklch(0.82 0.2 45)"
                          : "oklch(0.45 0.06 30)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── XP Level Bar ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 rounded-xl p-4"
        style={{
          background: "oklch(0.16 0.03 260 / 0.6)",
          border: "1px solid oklch(0.84 0.24 130 / 0.2)",
        }}
        data-ocid="challenges.xp.panel"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star
              className="w-4 h-4"
              style={{ color: "oklch(0.84 0.24 130)" }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: "oklch(0.84 0.24 130)" }}
            >
              Level {level}
            </span>
          </div>
          <span className="text-xs" style={{ color: "oklch(0.6 0.06 130)" }}>
            {totalXP} XP total · {toNext} XP to Level {level + 1}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2"
          style={{
            background: "oklch(0.22 0.04 260)",
          }}
        />
      </motion.div>

      {/* ── Daily Challenges ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
        data-ocid="challenges.daily.section"
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5" style={{ color: "oklch(0.84 0.24 130)" }} />
          <h2 className="text-xl font-display font-bold">Today's Challenges</h2>
          <Badge
            variant="secondary"
            className="ml-auto text-xs"
            style={{
              background: "oklch(0.84 0.24 130 / 0.12)",
              color: "oklch(0.84 0.24 130)",
              border: "1px solid oklch(0.84 0.24 130 / 0.25)",
            }}
          >
            {completedChallengeIds.length}/{dailyChallenges.length} done
          </Badge>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {dailyChallenges.map((challenge, i) => {
              const done = completedChallengeIds.includes(challenge.id);
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  data-ocid={`challenges.daily.item.${i + 1}`}
                >
                  <Card
                    className="transition-all"
                    style={{
                      background: done
                        ? "oklch(0.17 0.04 150 / 0.5)"
                        : "oklch(0.17 0.03 260 / 0.7)",
                      border: done
                        ? "1px solid oklch(0.55 0.18 150 / 0.4)"
                        : "1px solid oklch(0.84 0.24 130 / 0.15)",
                      opacity: done ? 0.75 : 1,
                    }}
                  >
                    <CardContent className="py-3.5 px-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                          style={{
                            background: done
                              ? "oklch(0.55 0.18 150 / 0.15)"
                              : "oklch(0.84 0.24 130 / 0.1)",
                          }}
                        >
                          {challenge.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">
                              {challenge.title}
                            </p>
                            <Badge
                              variant="secondary"
                              className="text-xs px-1.5 py-0"
                              style={{
                                background: "oklch(0.68 0.22 45 / 0.15)",
                                color: "oklch(0.78 0.18 50)",
                                border: "1px solid oklch(0.68 0.22 45 / 0.3)",
                              }}
                            >
                              +{challenge.xp} XP
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {challenge.description}
                          </p>
                        </div>
                        {done ? (
                          <CheckCircle2
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: "oklch(0.7 0.2 150)" }}
                          />
                        ) : (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleComplete(
                                challenge.id,
                                challenge.title,
                                challenge.xp,
                              )
                            }
                            className="flex-shrink-0 text-xs font-semibold"
                            style={{
                              background: "oklch(0.84 0.24 130 / 0.15)",
                              color: "oklch(0.84 0.24 130)",
                              border: "1px solid oklch(0.84 0.24 130 / 0.3)",
                            }}
                            data-ocid={`challenges.daily.primary_button.${i + 1}`}
                          >
                            Mark Done
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ── Badges ───────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        data-ocid="challenges.badges.section"
      >
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5" style={{ color: "oklch(0.78 0.2 55)" }} />
          <h2 className="text-xl font-display font-bold">Badges</h2>
          <Badge
            variant="secondary"
            className="ml-auto text-xs"
            style={{
              background: "oklch(0.68 0.22 45 / 0.12)",
              color: "oklch(0.78 0.18 50)",
              border: "1px solid oklch(0.68 0.22 45 / 0.3)",
            }}
          >
            {earnedBadgeIds.length}/{BADGES.length} earned
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES.map((badge, i) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                data-ocid={`challenges.badges.item.${i + 1}`}
              >
                <Card
                  className="relative overflow-hidden transition-all"
                  style={{
                    background: earned
                      ? "linear-gradient(135deg, oklch(0.2 0.07 55) 0%, oklch(0.16 0.05 45) 100%)"
                      : "oklch(0.15 0.02 260 / 0.7)",
                    border: earned
                      ? "1px solid oklch(0.7 0.25 55 / 0.6)"
                      : "1px solid oklch(0.3 0.03 260 / 0.4)",
                    boxShadow: earned
                      ? "0 0 20px oklch(0.7 0.25 55 / 0.2), 0 0 40px oklch(0.7 0.25 55 / 0.1)"
                      : "none",
                  }}
                >
                  {/* Gold shimmer for earned */}
                  {earned && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.85 0.22 65 / 0.08) 0%, transparent 50%, oklch(0.85 0.22 65 / 0.05) 100%)",
                      }}
                    />
                  )}
                  <CardContent className="p-4 text-center relative">
                    <div className="relative inline-block mb-2">
                      <span
                        className="text-3xl"
                        style={{
                          filter: earned
                            ? "drop-shadow(0 0 8px oklch(0.8 0.25 55 / 0.8))"
                            : "grayscale(1) opacity(0.3)",
                        }}
                      >
                        {badge.icon}
                      </span>
                      {!earned && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: "oklch(0.22 0.04 260)" }}
                        >
                          <Lock
                            className="w-2.5 h-2.5"
                            style={{ color: "oklch(0.5 0.04 260)" }}
                          />
                        </div>
                      )}
                    </div>
                    <p
                      className="text-xs font-semibold leading-tight"
                      style={{
                        color: earned
                          ? "oklch(0.85 0.2 55)"
                          : "oklch(0.45 0.04 260)",
                      }}
                    >
                      {badge.name}
                    </p>
                    <p
                      className="text-xs mt-0.5 leading-snug"
                      style={{
                        color: earned
                          ? "oklch(0.6 0.1 55)"
                          : "oklch(0.35 0.03 260)",
                      }}
                    >
                      {badge.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
