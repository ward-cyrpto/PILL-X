"use client";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div
              className="text-2xl font-black tracking-widest gold-shimmer mb-3"
              style={{ fontFamily: "var(--font-orbitron, monospace)" }}
            >
              PILL-X
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Physical Digital Asset. NFC-chipped pills permanently linked to NFTs on every major blockchain.
              Own the physical. Own the digital. Own the future.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://twitter.com/pillxnft"
                className="text-gray-500 hover:text-white transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
              <span className="text-gray-700">·</span>
              <a
                href="https://discord.gg/pillx"
                className="text-gray-500 hover:text-white transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
              <span className="text-gray-700">·</span>
              <a
                href="https://opensea.io/collection/pillx"
                className="text-gray-500 hover:text-white transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenSea
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="#tiers" className="hover:text-white transition-colors">Common Pill — $1,000</a></li>
              <li><a href="#tiers" className="hover:text-white transition-colors">Premium Pill — $2,500</a></li>
              <li><a href="#tiers" className="hover:text-white transition-colors">Gold Pill — $5,000</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="/verify" className="hover:text-white transition-colors">Verify NFC</a></li>
              <li><a href="/api/metadata/1.json" className="hover:text-white transition-colors">Metadata API</a></li>
              <li><a href="https://pill-x.com" className="hover:text-white transition-colors">pill-x.com</a></li>
              <li><a href="https://pillx.nextgen.com" className="hover:text-white transition-colors">pillx.nextgen.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} PILL-X. All rights reserved.</span>
          <span>pill-x.com · pillx.nextgen.com · Powered by Cloudflare</span>
        </div>
      </div>
    </footer>
  );
}
