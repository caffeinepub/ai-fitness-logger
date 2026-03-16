import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import {
  ClipboardList,
  Dumbbell,
  History,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Plus,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center transition-all group-hover:glow-lime">
              <Dumbbell className="w-4 h-4 text-primary" strokeWidth={2} />
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
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
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
          </nav>

          <div className="flex items-center gap-2">
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
