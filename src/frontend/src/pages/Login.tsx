import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

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
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full px-6"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-lime">
            <Dumbbell className="w-10 h-10 text-primary" strokeWidth={1.5} />
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

        <div className="w-full card-elevated rounded-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-display font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your workout dashboard and track your progress.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              "Log strength workouts",
              "Track calories burned",
              "AI-powered suggestions",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-lime transition-all"
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
