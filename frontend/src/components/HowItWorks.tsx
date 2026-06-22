"use client";

const STEPS = [
  {
    number: "01",
    title:  "Choose Your Tier",
    body:   "Select from Common, Premium, or Gold. Each tier comes with a unique NFC-chipped physical pill.",
    icon:   "💊",
  },
  {
    number: "02",
    title:  "Complete Purchase",
    body:   "Pay securely via PayPal or connect your crypto wallet. Your order is processed instantly.",
    icon:   "💳",
  },
  {
    number: "03",
    title:  "NFT Minted On-Chain",
    body:   "Your NFT is minted across all supported blockchains with your pill's unique NFC serial number embedded in the metadata.",
    icon:   "⛓️",
  },
  {
    number: "04",
    title:  "Receive Your Pill",
    body:   "Your physical PILL-X is shipped to you. Scan the NFC chip to verify authenticity and view your NFT.",
    icon:   "📦",
  },
  {
    number: "05",
    title:  "Scan & Verify",
    body:   "Tap any NFC-enabled phone to the pill. It instantly loads your NFT, ownership record, and drop rewards.",
    icon:   "📱",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 px-4 bg-white/2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-black mb-4 text-white"
            style={{ fontFamily: "var(--font-orbitron, monospace)" }}
          >
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">From purchase to physical digital ownership in minutes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center gap-4">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent" />
              )}

              {/* Icon bubble */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 border border-purple-500/50 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20 z-10">
                {step.icon}
                <span
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center"
                  style={{ fontFamily: "var(--font-orbitron, monospace)" }}
                >
                  {step.number.slice(1)}
                </span>
              </div>

              <div>
                <h3 className="text-white font-bold text-base mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
