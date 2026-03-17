import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  CreditCard,
  Crown,
  Dumbbell,
  Loader2,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

type PaymentMethod = "select" | "card" | "gpay";
type FormState = "idle" | "processing" | "success" | "error";

function GooglePayLogo({
  width = 44,
  height = 18,
}: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <title>Google Pay</title>
      <text
        x="0"
        y={height - 4}
        fontFamily="Arial"
        fontSize={height - 4}
        fontWeight="bold"
      >
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#34A853">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#EA4335">g</tspan>
        <tspan fill="#4285F4">l</tspan>
        <tspan fill="#34A853">e</tspan>
      </text>
      <text
        x={Math.round(width * 0.63)}
        y={height - 4}
        fontFamily="Arial"
        fontSize={height - 4}
        fontWeight="bold"
        fill="#5F6368"
      >
        Pay
      </text>
    </svg>
  );
}

export default function SubscriptionModal({
  open,
  onClose,
}: SubscriptionModalProps) {
  const { subscribe, trialLogsUsed } = useSubscription();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("select");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleCardPay = async () => {
    if (!cardNumber || !expiry || !cvv || !cardName) {
      setErrorMsg("Please fill in all card details.");
      return;
    }
    setErrorMsg("");
    setFormState("processing");
    await new Promise((r) => setTimeout(r, 2000));
    setFormState("success");
    await new Promise((r) => setTimeout(r, 1200));
    subscribe();
    onClose();
    setFormState("idle");
    setPaymentMethod("select");
  };

  const handleGpay = async () => {
    setFormState("processing");
    await new Promise((r) => setTimeout(r, 1800));
    setFormState("success");
    await new Promise((r) => setTimeout(r, 1200));
    subscribe();
    onClose();
    setFormState("idle");
    setPaymentMethod("select");
  };

  const handleClose = () => {
    if (formState === "processing") return;
    setPaymentMethod("select");
    setFormState("idle");
    setErrorMsg("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          data-ocid="subscription.modal"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            role="button"
            tabIndex={0}
            aria-label="Close payment modal"
            onClick={handleClose}
            onKeyDown={(e) => e.key === "Escape" && handleClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.13 0.015 265)",
              border: "1px solid oklch(0.84 0.24 130 / 0.3)",
              boxShadow:
                "0 0 60px oklch(0.84 0.24 130 / 0.2), 0 24px 48px oklch(0 0 0 / 0.6)",
            }}
          >
            {/* Top gradient bar */}
            <div
              className="h-1 w-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.84 0.24 130), oklch(0.68 0.22 45))",
              }}
            />

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* SELECT PAYMENT METHOD */}
                {paymentMethod === "select" && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex justify-center mb-6">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: "oklch(0.84 0.24 130 / 0.15)",
                          border: "2px solid oklch(0.84 0.24 130 / 0.4)",
                          boxShadow: "0 0 32px oklch(0.84 0.24 130 / 0.3)",
                        }}
                      >
                        <Crown
                          className="w-8 h-8"
                          style={{ color: "oklch(0.84 0.24 130)" }}
                        />
                      </div>
                    </div>

                    <h2 className="text-2xl font-display font-bold text-center mb-2">
                      Free Trial Ended
                    </h2>
                    <p
                      className="text-center text-sm mb-6"
                      style={{ color: "oklch(0.55 0.012 265)" }}
                    >
                      You've used all {trialLogsUsed} of your free workout
                      sessions. Upgrade to keep logging your gains!
                    </p>

                    <div
                      className="rounded-xl p-5 mb-6"
                      style={{
                        background: "oklch(0.84 0.24 130 / 0.08)",
                        border: "1px solid oklch(0.84 0.24 130 / 0.25)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span
                            className="font-display font-bold text-xl"
                            style={{ color: "oklch(0.84 0.24 130)" }}
                          >
                            ₹500
                          </span>
                          <span
                            className="text-sm ml-1"
                            style={{ color: "oklch(0.55 0.012 265)" }}
                          >
                            /month
                          </span>
                        </div>
                        <Badge
                          className="text-xs font-semibold px-2 py-1"
                          style={{
                            background: "oklch(0.84 0.24 130 / 0.2)",
                            color: "oklch(0.84 0.24 130)",
                            border: "1px solid oklch(0.84 0.24 130 / 0.3)",
                          }}
                        >
                          Pro Plan
                        </Badge>
                      </div>
                      <ul className="space-y-2">
                        {[
                          { icon: Star, label: "Unlimited workout sessions" },
                          { icon: Dumbbell, label: "All features unlocked" },
                          { icon: Zap, label: "AI Mentor consultations" },
                          { icon: CheckCircle2, label: "Ad-free experience" },
                        ].map(({ icon: Icon, label }) => (
                          <li
                            key={label}
                            className="flex items-center gap-2.5 text-sm"
                          >
                            <Icon
                              className="w-4 h-4 shrink-0"
                              style={{ color: "oklch(0.84 0.24 130)" }}
                            />
                            <span>{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="button"
                        onClick={() => setPaymentMethod("gpay")}
                        className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3"
                        style={{
                          background: "oklch(0.98 0.005 265)",
                          color: "oklch(0.15 0.015 265)",
                          boxShadow: "0 2px 12px oklch(0 0 0 / 0.3)",
                        }}
                        data-ocid="subscription.gpay.primary_button"
                      >
                        <GooglePayLogo width={52} height={20} />
                      </Button>

                      <Button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
                        style={{
                          background: "oklch(0.84 0.24 130)",
                          color: "oklch(0.1 0.015 130)",
                          boxShadow: "0 0 24px oklch(0.84 0.24 130 / 0.4)",
                        }}
                        data-ocid="subscription.card.primary_button"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay with Credit / Debit Card
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      <Lock
                        className="w-3 h-3"
                        style={{ color: "oklch(0.4 0.008 265)" }}
                      />
                      <p
                        className="text-center text-xs"
                        style={{ color: "oklch(0.4 0.008 265)" }}
                      >
                        Secured by 256-bit SSL encryption
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* GOOGLE PAY FLOW */}
                {paymentMethod === "gpay" && (
                  <motion.div
                    key="gpay"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setPaymentMethod("select")}
                      className="text-sm mb-6 flex items-center gap-1 px-0 h-auto"
                      style={{ color: "oklch(0.55 0.012 265)" }}
                      data-ocid="subscription.back.button"
                    >
                      ← Back
                    </Button>

                    <div className="text-center mb-8">
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ background: "oklch(0.98 0.005 265)" }}
                      >
                        <GooglePayLogo width={48} height={20} />
                      </div>
                      <h3 className="text-xl font-bold mb-1">
                        Pay with Google Pay
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.55 0.012 265)" }}
                      >
                        ₹500/month · AI Fitness Pro
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-4 mb-6 text-center"
                      style={{
                        background: "oklch(0.18 0.015 265)",
                        border: "1px solid oklch(0.3 0.012 265)",
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.65 0.012 265)" }}
                      >
                        You'll be redirected to Google Pay to complete your ₹500
                        payment securely.
                      </p>
                    </div>

                    {formState === "success" ? (
                      <div
                        className="flex flex-col items-center gap-2 py-4"
                        data-ocid="subscription.gpay.success_state"
                      >
                        <CheckCircle2
                          className="w-12 h-12"
                          style={{ color: "oklch(0.84 0.24 130)" }}
                        />
                        <p className="font-semibold">Payment Successful!</p>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleGpay}
                        disabled={formState === "processing"}
                        className="w-full h-12 text-base font-semibold rounded-xl"
                        style={{
                          background: "oklch(0.98 0.005 265)",
                          color: "oklch(0.15 0.015 265)",
                        }}
                        data-ocid="subscription.gpay.submit_button"
                      >
                        {formState === "processing" ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                            Processing...
                          </>
                        ) : (
                          "Continue with Google Pay"
                        )}
                      </Button>
                    )}
                  </motion.div>
                )}

                {/* CREDIT CARD FORM */}
                {paymentMethod === "card" && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setPaymentMethod("select")}
                      className="text-sm mb-5 flex items-center gap-1 px-0 h-auto"
                      style={{ color: "oklch(0.55 0.012 265)" }}
                      data-ocid="subscription.card.back.button"
                    >
                      ← Back
                    </Button>

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-lg font-bold">Card Details</h3>
                        <p
                          className="text-xs"
                          style={{ color: "oklch(0.55 0.012 265)" }}
                        >
                          ₹500/month · AI Fitness Pro
                        </p>
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <div
                          className="px-2 py-1 rounded"
                          style={{ background: "#1A1F71" }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            VISA
                          </span>
                        </div>
                        <div className="flex">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              background: "#EB001B",
                              marginRight: "-6px",
                              zIndex: 1,
                              position: "relative",
                            }}
                          />
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ background: "#F79E1B" }}
                          />
                        </div>
                        <div
                          className="px-1.5 py-0.5 rounded"
                          style={{
                            background: "#006DB7",
                            color: "white",
                            fontSize: "9px",
                            fontWeight: "bold",
                          }}
                        >
                          RuPay
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          className="text-xs mb-1.5 block"
                          style={{ color: "oklch(0.65 0.012 265)" }}
                        >
                          Card Number
                        </Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(formatCardNumber(e.target.value))
                          }
                          maxLength={19}
                          className="h-11 rounded-xl text-sm font-mono"
                          style={{
                            background: "oklch(0.18 0.015 265)",
                            border: "1px solid oklch(0.3 0.012 265)",
                            color: "oklch(0.9 0.01 265)",
                          }}
                          data-ocid="subscription.card.input"
                        />
                      </div>

                      <div>
                        <Label
                          className="text-xs mb-1.5 block"
                          style={{ color: "oklch(0.65 0.012 265)" }}
                        >
                          Cardholder Name
                        </Label>
                        <Input
                          placeholder="Name on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="h-11 rounded-xl text-sm"
                          style={{
                            background: "oklch(0.18 0.015 265)",
                            border: "1px solid oklch(0.3 0.012 265)",
                            color: "oklch(0.9 0.01 265)",
                          }}
                          data-ocid="subscription.cardholder.input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label
                            className="text-xs mb-1.5 block"
                            style={{ color: "oklch(0.65 0.012 265)" }}
                          >
                            Expiry Date
                          </Label>
                          <Input
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) =>
                              setExpiry(formatExpiry(e.target.value))
                            }
                            maxLength={5}
                            className="h-11 rounded-xl text-sm font-mono"
                            style={{
                              background: "oklch(0.18 0.015 265)",
                              border: "1px solid oklch(0.3 0.012 265)",
                              color: "oklch(0.9 0.01 265)",
                            }}
                            data-ocid="subscription.expiry.input"
                          />
                        </div>
                        <div>
                          <Label
                            className="text-xs mb-1.5 block"
                            style={{ color: "oklch(0.65 0.012 265)" }}
                          >
                            CVV
                          </Label>
                          <Input
                            placeholder="123"
                            value={cvv}
                            onChange={(e) =>
                              setCvv(
                                e.target.value.replace(/\D/g, "").slice(0, 4),
                              )
                            }
                            maxLength={4}
                            type="password"
                            className="h-11 rounded-xl text-sm font-mono"
                            style={{
                              background: "oklch(0.18 0.015 265)",
                              border: "1px solid oklch(0.3 0.012 265)",
                              color: "oklch(0.9 0.01 265)",
                            }}
                            data-ocid="subscription.cvv.input"
                          />
                        </div>
                      </div>
                    </div>

                    {errorMsg && (
                      <p
                        className="text-xs mt-3"
                        style={{ color: "oklch(0.65 0.2 25)" }}
                        data-ocid="subscription.card.error_state"
                      >
                        {errorMsg}
                      </p>
                    )}

                    {formState === "success" ? (
                      <div
                        className="flex flex-col items-center gap-2 py-4 mt-4"
                        data-ocid="subscription.card.success_state"
                      >
                        <CheckCircle2
                          className="w-12 h-12"
                          style={{ color: "oklch(0.84 0.24 130)" }}
                        />
                        <p className="font-semibold">Payment Successful!</p>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleCardPay}
                        disabled={formState === "processing"}
                        className="w-full h-12 text-base font-semibold rounded-xl mt-5"
                        style={{
                          background: "oklch(0.84 0.24 130)",
                          color: "oklch(0.1 0.015 130)",
                          boxShadow: "0 0 24px oklch(0.84 0.24 130 / 0.4)",
                        }}
                        data-ocid="subscription.card.submit_button"
                      >
                        {formState === "processing" ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" /> Pay ₹500 Securely
                          </>
                        )}
                      </Button>
                    )}

                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <Lock
                        className="w-3 h-3"
                        style={{ color: "oklch(0.4 0.008 265)" }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.4 0.008 265)" }}
                      >
                        256-bit SSL · PCI DSS Compliant
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
