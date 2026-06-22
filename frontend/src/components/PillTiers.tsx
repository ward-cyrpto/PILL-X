"use client";

import { TIERS, Tier } from "@/lib/tiers";

interface Props {
  onSelect: (tier: Tier) => void;
}

const TIER_STYLES = {
  common: {
    border:   "border-gray-600",
    badge:    "bg-gray-700 text-gray-200",
    button:   "bg-gray-600 hover:bg-gray-500 text-white",
    pill:     "from-gray-500 to-gray-700",
    price:    "text-gray-200",
    iconBg:   "from-gray-400 to-gray-600",
  },
  premium: {
    border:   "border-purple-500",
    badge:    "bg-purple-600 text-white",
    button:   "bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white",
    pill:     "from-purple-500 to-cyan-500",
    price:    "text-purple-300",
    iconBg:   "from-purple-400 to-cyan-400",
  },
  gold: {
    border:   "border-yellow-400",
    badge:    "bg-gradient-to-r from-yellow-400 to-orange-500 text-black",
    button:   "bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-black",
    pill:     "from-yellow-400 to-orange-500",
    price:    "text-yellow-400",
    iconBg:   "from-yellow-300 to-orange-400",
  },
};

export default function PillTiers({ onSelect }: Props) {
  return (
    <section id="tiers" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2
          className="text-4xl md:text-5xl font-black mb-4"
          style={{ fontFamily: "var(--font-orbitron, monospace)" }}
        >
          <span className="gold-shimmer">Choose Your Pill</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Three tiers. One NFC chip. Infinite blockchain presence.
          Select your tier and claim your physical digital asset.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TIERS.map((tier) => {
          const s = TIER_STYLES[tier.id];
          return (
            <div
              key={tier.id}
              className={`relative rounded-3xl border ${s.border} bg-white/5 backdrop-blur-sm p-8 flex flex-col gap-6 hover:scale-105 transition-transform duration-300 ${tier.id === "gold" ? "pill-card-gold" : tier.id === "premium" ? "pill-card-premium" : "pill-card-common"}`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black tracking-widest ${s.badge}`}>
                  {tier.badge}
                </div>
              )}

              {/* Pill icon */}
              <div className="flex justify-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${s.iconBg} flex items-center justify-center shadow-xl`}>
                  <span className="text-4xl">💊</span>
                </div>
              </div>

              {/* Tier name */}
              <div className="text-center">
                <div
                  className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1"
                  style={{ fontFamily: "var(--font-orbitron, monospace)" }}
                >
                  {tier.id === "gold" ? "Ultra Rare" : tier.id === "premium" ? "Exclusive" : "Standard"}
                </div>
                <h3
                  className={`text-3xl font-black ${s.price}`}
                  style={{ fontFamily: "var(--font-orbitron, monospace)" }}
                >
                  {tier.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{tier.tagline}</p>
              </div>

              {/* Price */}
              <div className="text-center">
                <div className={`text-5xl font-black ${s.price}`} style={{ fontFamily: "var(--font-orbitron, monospace)" }}>
                  ${tier.price.toLocaleString()}
                </div>
                <div className="text-gray-500 text-sm">per pill • {tier.supply.toLocaleString()} total</div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed text-center">
                {tier.description}
              </p>

              {/* Perks */}
              <ul className="flex flex-col gap-2">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>

              {/* Supply bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Supply</span>
                  <span>{tier.supply.toLocaleString()} pills</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${s.pill} rounded-full`}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => onSelect(tier.id)}
                className={`w-full py-4 rounded-2xl font-black text-lg tracking-wide transition-opacity ${s.button}`}
              >
                Buy {tier.name} — ${tier.price.toLocaleString()}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
