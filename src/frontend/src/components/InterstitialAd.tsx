import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface InterstitialAdProps {
  show: boolean;
  onClose: () => void;
}

const AD_CONTENT = {
  brand: "FitPro Gear",
  tagline: "Premium Gym Equipment for Champions",
  cta: "Shop the Collection",
  badge: "SPONSORED",
  accent: "oklch(0.68 0.22 45)",
};

export default function InterstitialAd({ show, onClose }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (show) {
      setCountdown(5);
      setCanSkip(false);

      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            onClose();
            return 0;
          }
          if (prev === 3) setCanSkip(true);
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          data-ocid="ad.interstitial.panel"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.13 0.015 265)",
              border: "1px solid oklch(0.68 0.22 45 / 0.3)",
              boxShadow:
                "0 0 60px oklch(0.68 0.22 45 / 0.15), 0 24px 48px oklch(0 0 0 / 0.6)",
            }}
          >
            {/* Top bar */}
            <div
              className="h-1"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.68 0.22 45), oklch(0.84 0.24 130))",
              }}
            />

            {/* Top controls */}
            <div className="flex items-center justify-between px-5 pt-4">
              <span
                className="text-xs font-bold tracking-widest px-2 py-0.5 rounded"
                style={{
                  background: "oklch(0.68 0.22 45 / 0.15)",
                  color: "oklch(0.68 0.22 45)",
                  border: "1px solid oklch(0.68 0.22 45 / 0.3)",
                }}
              >
                {AD_CONTENT.badge}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-mono"
                  style={{ color: "oklch(0.55 0.012 265)" }}
                >
                  Ad closes in {countdown}s
                </span>
                <AnimatePresence>
                  {canSkip && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClose}
                        className="h-7 px-2 text-xs gap-1"
                        style={{ color: "oklch(0.55 0.012 265)" }}
                        data-ocid="ad.interstitial.skip.button"
                      >
                        Skip <X className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Ad content */}
            <div className="px-5 py-6 text-center">
              {/* Brand icon placeholder */}
              <div
                className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.22 45 / 0.2), oklch(0.84 0.24 130 / 0.1))",
                  border: "1px solid oklch(0.68 0.22 45 / 0.3)",
                }}
              >
                <span className="text-3xl">🏋️</span>
              </div>

              <p
                className="text-xs uppercase tracking-widest mb-2 font-semibold"
                style={{ color: "oklch(0.68 0.22 45)" }}
              >
                Powered by {AD_CONTENT.brand}
              </p>
              <h3 className="text-2xl font-display font-bold mb-3">
                {AD_CONTENT.tagline}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "oklch(0.55 0.012 265)" }}
              >
                Elevate your training with professional-grade barbells, plates,
                and machines trusted by elite athletes worldwide.
              </p>

              <div
                className="rounded-xl p-4 mb-5 text-left"
                style={{
                  background: "oklch(0.68 0.22 45 / 0.08)",
                  border: "1px solid oklch(0.68 0.22 45 / 0.2)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="text-sm font-semibold">
                      Limited Offer — 20% OFF
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.012 265)" }}
                    >
                      Use code FITLOGGER at checkout
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar countdown */}
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: "oklch(0.22 0.01 265)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "oklch(0.68 0.22 45)" }}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(countdown / 5) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
