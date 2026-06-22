"use client";

interface Props {
  onShop: () => void;
}

export default function HeroSection({ onShop }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Pill icon placeholder */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-400/30">
              <span className="text-4xl">💊</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-6xl md:text-8xl font-black tracking-tight mb-4 gold-shimmer"
          style={{ fontFamily: "var(--font-orbitron, monospace)" }}
        >
          PILL-X
        </h1>

        <p
          className="text-xl md:text-2xl font-semibold text-purple-300 mb-3 tracking-widest uppercase"
          style={{ fontFamily: "var(--font-orbitron, monospace)" }}
        >
          Physical Digital Asset
        </p>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          40,000 pills. Each embedded with an NFC chip permanently linked to a unique NFT
          on every major blockchain. Own the physical. Own the digital. Own the future.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { label: "Total Supply",      value: "40,000" },
            { label: "Common Pills",      value: "30,000" },
            { label: "Premium Pills",     value: "7,500"  },
            { label: "Gold Pills",        value: "2,500"  },
            { label: "Blockchains",       value: "7+"     },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div
                className="text-3xl font-black gold-shimmer"
                style={{ fontFamily: "var(--font-orbitron, monospace)" }}
              >
                {value}
              </div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onShop}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-yellow-400/20"
          >
            Shop Pills
          </button>
          <a
            href="#how"
            className="px-10 py-4 rounded-full border border-purple-500 text-purple-300 font-semibold text-lg hover:bg-purple-500/10 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
