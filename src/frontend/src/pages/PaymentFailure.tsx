import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "oklch(0.10 0.015 265)" }}
      data-ocid="payment-failure.page"
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, oklch(0.55 0.2 25 / 0.1), transparent)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-md rounded-2xl overflow-hidden text-center"
        style={{
          background: "oklch(0.13 0.015 265)",
          border: "1px solid oklch(0.55 0.2 25 / 0.35)",
          boxShadow:
            "0 0 60px oklch(0.55 0.2 25 / 0.15), 0 24px 48px oklch(0 0 0 / 0.6)",
        }}
      >
        {/* Top gradient bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.55 0.2 25), oklch(0.65 0.22 45))",
          }}
        />

        <div className="p-10">
          {/* Error icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="flex justify-center mb-6"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.55 0.2 25 / 0.15)",
                border: "2px solid oklch(0.55 0.2 25 / 0.5)",
                boxShadow: "0 0 40px oklch(0.55 0.2 25 / 0.3)",
              }}
            >
              <AlertCircle
                className="w-10 h-10"
                style={{ color: "oklch(0.65 0.2 25)" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h1 className="text-3xl font-display font-bold mb-2">
              Payment Not Completed
            </h1>
            <p
              className="text-base mb-8"
              style={{ color: "oklch(0.6 0.012 265)" }}
            >
              Your payment was cancelled or could not be processed. No charge
              was made to your account.
            </p>
          </motion.div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl p-5 mb-8"
            style={{
              background: "oklch(0.55 0.2 25 / 0.08)",
              border: "1px solid oklch(0.55 0.2 25 / 0.2)",
            }}
          >
            <p className="text-sm" style={{ color: "oklch(0.65 0.012 265)" }}>
              Possible reasons: payment was cancelled, insufficient funds, or
              card declined. You can try again with a different payment method.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="space-y-3"
          >
            <Button
              onClick={() => navigate({ to: "/" })}
              className="w-full h-12 text-base font-semibold rounded-xl"
              style={{
                background: "oklch(0.84 0.24 130)",
                color: "oklch(0.1 0.015 130)",
                boxShadow: "0 0 24px oklch(0.84 0.24 130 / 0.4)",
              }}
              data-ocid="payment-failure.retry.primary_button"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>

            <Button
              onClick={() => navigate({ to: "/" })}
              variant="ghost"
              className="w-full h-11 text-sm rounded-xl"
              style={{ color: "oklch(0.55 0.012 265)" }}
              data-ocid="payment-failure.home.secondary_button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
