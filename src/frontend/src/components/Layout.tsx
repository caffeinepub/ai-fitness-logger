import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import {
  Bot,
  ClipboardList,
  History,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AdBanner from "./AdBanner";
import InterstitialAd from "./InterstitialAd";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  { to: "/log", label: "Log Workout", icon: Plus, ocid: "nav.log.link" },
  { to: "/history", label: "History", icon: History, ocid: "nav.history.link" },
  {
    to: "/suggestions",
    label: "Suggestions",
    icon: Lightbulb,
    ocid: "nav.suggestions.link",
  },
  { to: "/mentor", label: "AI Mentor", icon: Bot, ocid: "nav.mentor.link" },
  { to: "/profile", label: "Profile", icon: User, ocid: "nav.profile.link" },
  {
    to: "/survey",
    label: "Survey",
    icon: ClipboardList,
    ocid: "nav.survey.link",
  },
];

export default function Layout() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isSubscribed, trialLogsRemaining, trialLogsUsed } = useSubscription();

  // Interstitial ad logic
  const navCountRef = useRef(0);
  const [showAd, setShowAd] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname;
      if (!isSubscribed) {
        navCountRef.current += 1;
        if (navCountRef.current % 3 === 0) {
          setShowAd(true);
        }
      }
    }
  }, [location.pathname, isSubscribed]);

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: "/login" });
    }
  }, [identity, isInitializing, navigate]);

  if (isInitializing || !identity) return null;

  const handleLogout = () => {
    clear();
    navigate({ to: "/login" });
  };

  const trialActive = !isSubscribed && trialLogsUsed < 5;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Interstitial Ad */}
      <InterstitialAd show={showAd} onClose={() => setShowAd(false)} />

      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center transition-all group-hover:glow-lime overflow-hidden">
              <img
                src="/assets/generated/logo-transparent.dim_200x200.png"
                alt="FitLogger AI logo"
                className="w-7 h-7 object-cover rounded-lg"
              />
            </div>
            <span className="font-display font-bold text-lg text-gradient-lime">
              FitLogger AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid={item.ocid}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Trial badge */}
            {trialActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.84 0.24 130 / 0.12)",
                  color: "oklch(0.84 0.24 130)",
                  border: "1px solid oklch(0.84 0.24 130 / 0.3)",
                }}
                data-ocid="trial.badge.panel"
              >
                <Sparkles className="w-3 h-3" />
                {trialLogsRemaining} free session
                {trialLogsRemaining !== 1 ? "s" : ""} left
              </motion.div>
            )}
            {isSubscribed && (
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.68 0.22 45 / 0.12)",
                  color: "oklch(0.68 0.22 45)",
                  border: "1px solid oklch(0.68 0.22 45 / 0.3)",
                }}
              >
                ✦ Pro
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <nav className="flex flex-col p-3 gap-1">
                {trialActive && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold mb-1"
                    style={{
                      background: "oklch(0.84 0.24 130 / 0.1)",
                      color: "oklch(0.84 0.24 130)",
                      border: "1px solid oklch(0.84 0.24 130 / 0.2)",
                    }}
                    data-ocid="trial.badge.panel"
                  >
                    <Sparkles className="w-3 h-3" />
                    {trialLogsRemaining} free session
                    {trialLogsRemaining !== 1 ? "s" : ""} left
                  </div>
                )}
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      data-ocid={item.ocid}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <AdBanner />

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
