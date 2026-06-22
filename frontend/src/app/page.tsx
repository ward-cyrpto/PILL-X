"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PillTiers from "@/components/PillTiers";
import HowItWorks from "@/components/HowItWorks";
import BlockchainSupport from "@/components/BlockchainSupport";
import CheckoutModal from "@/components/CheckoutModal";
import Footer from "@/components/Footer";
import { Tier } from "@/lib/tiers";

export default function HomePage() {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <HeroSection onShop={() => document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" })} />
      <PillTiers onSelect={setSelectedTier} />
      <HowItWorks />
      <BlockchainSupport />
      <Footer />

      {selectedTier && (
        <CheckoutModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
      )}
    </main>
  );
}
