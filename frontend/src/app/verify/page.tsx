"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface VerifyResult {
  found:       boolean;
  serial:      string;
  tier?:       string;
  tokenId?:    number;
  nftUrl?:     string;
  openseaUrl?: string;
}

export default function VerifyPage() {
  const [serial,  setSerial]  = useState("");
  const [result,  setResult]  = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!serial.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch(`/api/verify/${serial.trim().toUpperCase()}`);
      const data = await res.json();

      if (res.status === 400) { setError(data.error); return; }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const TIER_LABELS: Record<string, string> = {
    common:  "Common  — $1,000",
    premium: "Premium — $2,500",
    gold:    "Gold    — $5,000",
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">📱</div>
            <h1
              className="text-4xl font-black text-white mb-3"
              style={{ fontFamily: "var(--font-orbitron, monospace)" }}
            >
              Verify Your Pill
            </h1>
            <p className="text-gray-400">
              Enter the NFC serial number printed on your PILL-X (or tap your phone to the pill).
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <input
              type="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3D4E5F6"
              maxLength={12}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-lg placeholder-gray-600 focus:outline-none focus:border-purple-500 tracking-widest text-center uppercase"
            />
            <button
              type="submit"
              disabled={loading || serial.length !== 12}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black text-lg hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? "Verifying…" : "Verify Authenticity"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {result && (
            <div className={`mt-6 p-6 rounded-2xl border ${result.found ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              {result.found ? (
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
                    <span>✓</span> Authentic PILL-X
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <span className="text-gray-500">Serial</span>
                    <span className="font-mono">{result.serial}</span>
                    <span className="text-gray-500">Tier</span>
                    <span className="capitalize font-semibold">{TIER_LABELS[result.tier!] ?? result.tier}</span>
                    <span className="text-gray-500">Token ID</span>
                    <span>#{result.tokenId}</span>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <a
                      href={result.nftUrl}
                      className="text-center py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
                    >
                      View NFT
                    </a>
                    <a
                      href={result.openseaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center py-2 rounded-xl border border-white/10 text-gray-300 hover:border-white/30 font-semibold transition-colors"
                    >
                      View on OpenSea
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-red-400 text-center font-semibold">
                  Serial {result.serial} not found. This pill may be counterfeit.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
