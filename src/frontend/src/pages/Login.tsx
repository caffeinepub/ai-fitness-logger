import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Flame, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  { text: "Log strength workouts", icon: Dumbbell, color: "text-primary" },
  { text: "Track calories burned", icon: Flame, color: "text-destructive" },
  { text: "AI-powered suggestions", icon: Zap, color: "text-accent" },
  {
    text: "Progressive overload tracking",
    icon: TrendingUp,
    color: "text-chart-3",
  },
];

const floatVariants = [
  { x: -60, y: -80, size: 6, delay: 0, duration: 4 },
  { x: 120, y: -40, size: 4, delay: 0.8, duration: 5.5 },
  { x: 80, y: 100, size: 8, delay: 1.4, duration: 3.8 },
  { x: -100, y: 60, size: 5, delay: 2.1, duration: 4.8 },
];

export default function LoginPage() {
  const { login, isLoginError, identity, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/" });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating particle dots */}
      {floatVariants.map((p) => (
        <motion.div
          key={`particle-${p.x}-${p.y}`}
          className="absolute rounded-full bg-primary/40 pointer-events-none"
          style={{ width: p.size, height: p.size, left: "50%", top: "50%" }}
          animate={{
            x: [p.x, p.x + 20, p.x - 10, p.x],
            y: [p.y, p.y - 30, p.y + 15, p.y],
            opacity: [0.2, 0.6, 0.3, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full px-6"
      >
        {/* Logo with glowing rings */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            {/* Concentric pulse rings */}
            <div className="absolute w-36 h-36 rounded-full border-2 border-primary/30 ring-pulse-1" />
            <div className="absolute w-52 h-52 rounded-full border border-primary/15 ring-pulse-2" />
            <div className="absolute w-72 h-72 rounded-full border border-primary/08 ring-pulse-3" />
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-center glow-lime relative z-10 overflow-hidden">
              <img
                src="/assets/generated/logo-transparent.dim_200x200.png"
                alt="AI Fitness Logger logo"
                className="w-full h-full object-cover rounded-2xl logo-pulse"
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-gradient-lime">
              AI Fitness Logger
            </h1>
            <p className="mt-2 text-muted-foreground text-lg">
              Track workouts. Burn calories. Get stronger.
            </p>
          </div>
        </div>

        {/* Hero gym banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full rounded-xl overflow-hidden relative h-36 shadow-lg"
        >
          <img
            src="/assets/generated/hero-gym.dim_900x400.jpg"
            alt="Modern gym with equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p className="text-sm font-semibold text-foreground">
              Your gym. Your gains.
            </p>
            <p className="text-xs text-muted-foreground">
              AI-powered strength tracking
            </p>
          </div>
        </motion.div>

        <div className="w-full card-elevated rounded-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-display font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your workout dashboard and track your progress.
            </p>
          </div>

          {/* Bold tagline */}
          <p className="text-sm font-semibold text-foreground/80 border-l-2 border-primary pl-3 leading-snug">
            Built for athletes who track every rep.
          </p>

          <div className="flex flex-col gap-3">
            {features.map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <f.icon className={`w-4 h-4 flex-shrink-0 ${f.color}`} />
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-lime btn-glow-pulse transition-all"
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? "Connecting..." : "Sign In"}
          </Button>

          {isLoginError && (
            <p
              className="text-destructive text-sm text-center"
              data-ocid="login.error_state"
            >
              Login failed. Please try again.
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Internet Identity — secure, passwordless authentication
        </p>
      </motion.div>
    </div>
  );
}
