import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const TRIAL_KEY = "fitlogger_trial_count";
const SUB_KEY = "fitlogger_subscribed";
const MAX_TRIALS = 5;

interface SubscriptionContextValue {
  trialLogsUsed: number;
  isSubscribed: boolean;
  canLog: boolean;
  trialLogsRemaining: number;
  incrementTrial: () => void;
  subscribe: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

export function SubscriptionProvider({
  children,
}: { children: React.ReactNode }) {
  const [trialLogsUsed, setTrialLogsUsed] = useState<number>(() => {
    const stored = localStorage.getItem(TRIAL_KEY);
    return stored ? Number.parseInt(stored, 10) : 0;
  });

  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem(SUB_KEY) === "true";
  });

  const canLog = isSubscribed || trialLogsUsed < MAX_TRIALS;
  const trialLogsRemaining = Math.max(0, MAX_TRIALS - trialLogsUsed);

  const incrementTrial = useCallback(() => {
    if (!isSubscribed) {
      setTrialLogsUsed((prev) => {
        const next = prev + 1;
        localStorage.setItem(TRIAL_KEY, String(next));
        return next;
      });
    }
  }, [isSubscribed]);

  const subscribe = useCallback(() => {
    setIsSubscribed(true);
    localStorage.setItem(SUB_KEY, "true");
  }, []);

  const value = useMemo(
    () => ({
      trialLogsUsed,
      isSubscribed,
      canLog,
      trialLogsRemaining,
      incrementTrial,
      subscribe,
    }),
    [
      trialLogsUsed,
      isSubscribed,
      canLog,
      trialLogsRemaining,
      incrementTrial,
      subscribe,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx)
    throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
