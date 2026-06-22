"use client";

import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { TIERS, Tier } from "@/lib/tiers";

const PAYPAL_CLIENT_ID   = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_PAYEE_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_PAYEE_EMAIL;

interface Props {
  tier: Tier;
  onClose: () => void;
}

type Step = "details" | "paying" | "success" | "error";

export default function CheckoutModal({ tier, onClose }: Props) {
  const tierInfo  = TIERS.find((t) => t.id === tier)!;
  const [step, setStep]   = useState<Step>("details");
  const [txId, setTxId]   = useState("");
  const [error, setError] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [connecting, setConnecting] = useState(false);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function connectWallet() {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("No Web3 wallet detected. Install MetaMask to receive your NFT.");
      return;
    }
    setConnecting(true);
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddr(accounts[0]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setConnecting(false);
    }
  }

  const TIER_COLOR = {
    common:  "from-gray-500 to-gray-700",
    premium: "from-purple-600 to-cyan-500",
    gold:    "from-yellow-400 to-orange-500",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${TIER_COLOR[tier]} p-6 flex items-center justify-between`}>
          <div>
            <div className="text-xs font-bold tracking-widest uppercase opacity-80 mb-1">PILL-X</div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-orbitron, monospace)" }}>
              {tierInfo.name} Pill
            </h2>
            <div className="text-white/80 text-sm">{tierInfo.tagline}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-orbitron, monospace)" }}>
              ${tierInfo.price.toLocaleString()}
            </div>
            <div className="text-white/60 text-xs">USD</div>
          </div>
        </div>

        <div className="p-6">
          {/* ── Step: Details ─────────────────────────────────────────── */}
          {step === "details" && (
            <div className="flex flex-col gap-5">
              {/* Wallet connect */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-sm font-semibold text-gray-300 mb-2">1. Connect Wallet (receive NFT)</div>
                {walletAddr ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span>✓</span>
                    <span className="font-mono truncate">{walletAddr}</span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={connecting}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {connecting ? "Connecting…" : "Connect MetaMask / WalletConnect"}
                  </button>
                )}
              </div>

              {/* Perks summary */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-sm font-semibold text-gray-300 mb-3">2. What you get</div>
                <ul className="flex flex-col gap-1.5">
                  {tierInfo.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-green-400 shrink-0">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment note */}
              <div className="text-xs text-gray-500 text-center">
                Payment processed securely via PayPal. Your NFC serial & NFT are assigned post-payment.
              </div>

              <button
                onClick={() => setStep("paying")}
                className={`w-full py-4 rounded-2xl font-black text-lg bg-gradient-to-r ${TIER_COLOR[tier]} ${tier === "gold" ? "text-black" : "text-white"} hover:opacity-90 transition-opacity`}
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* ── Step: Payment ──────────────────────────────────────────── */}
          {step === "paying" && (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <div className="text-gray-300 font-semibold mb-1">Pay with PayPal</div>
                <div className="text-gray-500 text-sm">Secure checkout — ${tierInfo.price.toLocaleString()} USD</div>
              </div>

              {(!PAYPAL_CLIENT_ID || !PAYPAL_PAYEE_EMAIL) ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                  PayPal is not configured. Please contact support.
                </div>
              ) : (
              <PayPalScriptProvider
                options={{
                  clientId: PAYPAL_CLIENT_ID,
                  currency: "USD",
                  intent:   "capture",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical", shape: "pill", color: "gold" }}
                  createOrder={(_data, actions) =>
                    actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          description: `PILL-X ${tierInfo.name} — NFC NFT Twin`,
                          amount: {
                            currency_code: "USD",
                            value:         tierInfo.price.toFixed(2),
                          },
                          payee: { email_address: PAYPAL_PAYEE_EMAIL },
                        },
                      ],
                    })
                  }
                  onApprove={async (_data, actions) => {
                    const order = await actions.order!.capture();
                    setTxId(order.id ?? "");
                    setStep("success");
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    setError("Payment failed. Please try again.");
                    setStep("error");
                  }}
                  onCancel={() => setStep("details")}
                />
              </PayPalScriptProvider>
              )}

              <button
                onClick={() => setStep("details")}
                className="text-gray-500 text-sm text-center hover:text-gray-300 transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── Step: Success ──────────────────────────────────────────── */}
          {step === "success" && (
            <div className="text-center flex flex-col items-center gap-5 py-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-4xl">
                ✓
              </div>
              <div>
                <h3 className="text-2xl font-black text-green-400 mb-2">Payment Confirmed!</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your PILL-X {tierInfo.name} has been reserved. Your NFC serial number
                  and NFT will be minted and sent to your wallet within 24 hours.
                </p>
                {txId && (
                  <p className="text-gray-600 text-xs mt-3 font-mono break-all">
                    Order ID: {txId}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-green-500 hover:bg-green-400 text-black font-bold transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* ── Step: Error ────────────────────────────────────────────── */}
          {step === "error" && (
            <div className="text-center flex flex-col items-center gap-5 py-4">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-4xl">
                ✕
              </div>
              <div>
                <h3 className="text-2xl font-black text-red-400 mb-2">Payment Failed</h3>
                <p className="text-gray-400 text-sm">{error || "Something went wrong. Please try again."}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("paying")}
                  className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-400 text-white font-bold transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full border border-gray-600 text-gray-300 font-semibold hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
