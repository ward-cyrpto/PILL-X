export type Tier = "common" | "premium" | "gold";

export interface TierInfo {
  id:          Tier;
  name:        string;
  price:       number;      // USD
  supply:      number;
  minted?:     number;
  tagline:     string;
  description: string;
  perks:       string[];
  color:       string;      // Tailwind gradient class key
  glow:        string;
  badge?:      string;
}

export const TIERS: TierInfo[] = [
  {
    id:          "common",
    name:        "Common",
    price:       1000,
    supply:      30_000,
    tagline:     "Your Entry Into The Digital Physical World",
    description: "Each Common PILL-X contains an embedded NFC chip permanently paired to a blockchain NFT. Scan the pill, own the token — forever.",
    perks: [
      "Unique NFC Serial Number",
      "ERC-721 NFT on all major blockchains",
      "Permanent on-chain ownership record",
      "NFC verification portal access",
      "PILL-X member community access",
    ],
    color: "common-gradient",
    glow:  "pill-card-common",
  },
  {
    id:          "premium",
    name:        "Premium",
    price:       2500,
    supply:      7_500,
    tagline:     "Exclusive Drops Await",
    description: "Premium PILL-X holders receive an exclusive NFT drop on top of the NFC-linked blockchain twin. Unlock rare digital collectibles with your pill.",
    perks: [
      "Everything in Common",
      "Exclusive NFT Drop Included",
      "Priority access to future drops",
      "Premium holder Discord channel",
      "Early access to PILL-X launches",
    ],
    color: "premium-gradient",
    glow:  "pill-card-premium",
    badge: "NFT DROP INCLUDED",
  },
  {
    id:          "gold",
    name:        "Gold",
    price:       5000,
    supply:      2_500,
    tagline:     "Ultra Rare. Ultimate Status.",
    description: "Only 2,500 Gold PILL-X exist. Each integrates a special NFT drop experience exclusive to Gold holders. The apex of physical digital ownership.",
    perks: [
      "Everything in Premium",
      "Special Integrated NFT Drop Experience",
      "Gold-tier exclusive content vault",
      "VIP access to all PILL-X events",
      "Direct line to the PILL-X team",
      "First allocation on future collections",
    ],
    color: "gold-gradient",
    glow:  "pill-card-gold",
    badge: "SPECIAL DROP",
  },
];

export const TIER_PRICES_USD: Record<Tier, number> = {
  common:  1000,
  premium: 2500,
  gold:    5000,
};
