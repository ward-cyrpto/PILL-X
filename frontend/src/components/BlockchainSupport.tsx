"use client";

const CHAINS = [
  { name: "Ethereum",  symbol: "ETH", color: "#627EEA", chainId: 1      },
  { name: "Polygon",   symbol: "POL", color: "#8247E5", chainId: 137    },
  { name: "BNB Chain", symbol: "BNB", color: "#F3BA2F", chainId: 56     },
  { name: "Avalanche", symbol: "AVAX",color: "#E84142", chainId: 43114  },
  { name: "Arbitrum",  symbol: "ARB", color: "#28A0F0", chainId: 42161  },
  { name: "Optimism",  symbol: "OP",  color: "#FF0420", chainId: 10     },
  { name: "Base",      symbol: "BASE",color: "#0052FF", chainId: 8453   },
];

export default function BlockchainSupport() {
  return (
    <section id="chains" className="py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-black mb-4 text-white"
          style={{ fontFamily: "var(--font-orbitron, monospace)" }}
        >
          Every Major Blockchain
        </h2>
        <p className="text-gray-400 text-lg mb-14 max-w-2xl mx-auto">
          Your PILL-X NFT is accessible and transferable on all supported chains.
          Own your pill everywhere.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {CHAINS.map((chain) => (
            <div
              key={chain.chainId}
              className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:scale-105 transition-all duration-200 w-32"
            >
              {/* Chain color dot */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm border-2"
                style={{ borderColor: chain.color, background: chain.color + "22" }}
              >
                <span style={{ color: chain.color, fontFamily: "var(--font-orbitron, monospace)", fontSize: 11 }}>
                  {chain.symbol}
                </span>
              </div>
              <div className="text-white text-sm font-semibold">{chain.name}</div>
              <div className="text-gray-600 text-xs">Chain {chain.chainId}</div>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-sm mt-10">
          More chains added continuously. All contracts are ERC-721 and ERC-2981 (royalty) compliant.
        </p>
      </div>
    </section>
  );
}
