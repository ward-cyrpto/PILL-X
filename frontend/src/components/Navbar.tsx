"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="text-2xl font-black tracking-widest gold-shimmer"
            style={{ fontFamily: "var(--font-orbitron, monospace)" }}
          >
            PILL-X
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#tiers"     className="hover:text-white transition-colors">Shop</a>
          <a href="#how"       className="hover:text-white transition-colors">How It Works</a>
          <a href="#chains"    className="hover:text-white transition-colors">Blockchains</a>
          <Link
            href="/verify"
            className="hover:text-white transition-colors"
          >
            Verify NFC
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#tiers"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Buy Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm">
          <a href="#tiers"  onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">Shop</a>
          <a href="#how"    onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">How It Works</a>
          <a href="#chains" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">Blockchains</a>
          <Link href="/verify" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">Verify NFC</Link>
          <a
            href="#tiers"
            onClick={() => setOpen(false)}
            className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-center"
          >
            Buy Now
          </a>
        </div>
      )}
    </nav>
  );
}
