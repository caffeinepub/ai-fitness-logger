import { ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";

const ADS = [
  {
    sponsor: "FitPro Gear",
    message: "Premium Gym Equipment — Built for Champions",
    cta: "Shop Now →",
    emoji: "🏋️",
  },
  {
    sponsor: "MuscleMax Supplements",
    message: "Fuel Your Gains with Science-Backed Nutrition",
    cta: "Explore Range →",
    emoji: "💪",
  },
  {
    sponsor: "IronEdge Apparel",
    message: "Train in Style — Performance Activewear",
    cta: "View Collection →",
    emoji: "👕",
  },
];

export default function AdBanner() {
  const { isSubscribed } = useSubscription();
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    if (isSubscribed) return;
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % ADS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isSubscribed]);

  if (isSubscribed) return null;

  const ad = ADS[adIndex];

  return (
    <div
      className="border-t px-4 py-2.5"
      style={{
        borderColor: "oklch(0.24 0.012 265)",
        background: "oklch(0.11 0.01 265 / 0.95)",
      }}
      data-ocid="ad.banner.panel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={adIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold tracking-widest px-1.5 py-0.5 rounded shrink-0"
              style={{
                background: "oklch(0.68 0.22 45 / 0.12)",
                color: "oklch(0.68 0.22 45)",
                border: "1px solid oklch(0.68 0.22 45 / 0.25)",
              }}
            >
              AD
            </span>
            <span className="text-sm">{ad.emoji}</span>
            <div className="min-w-0">
              <span
                className="text-xs font-semibold mr-1.5"
                style={{ color: "oklch(0.68 0.22 45)" }}
              >
                {ad.sponsor}
              </span>
              <span
                className="text-xs"
                style={{ color: "oklch(0.55 0.012 265)" }}
              >
                — {ad.message}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 flex items-center gap-1 text-xs font-medium ml-4 hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.84 0.24 130)" }}
          >
            {ad.cta} <ExternalLink className="w-3 h-3" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
