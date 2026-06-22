#!/usr/bin/env node
/**
 * generate-metadata.js
 * Generates OpenSea-compatible ERC-721 metadata JSON files for all 40,000 PILL-X NFTs.
 *
 * Prerequisites:
 *   node scripts/generate-serials.js   (creates metadata/serials.json)
 *
 * Output:
 *   metadata/tokens/{tokenId}.json
 *
 * Usage:
 *   node scripts/generate-metadata.js
 */

"use strict";

const fs   = require("fs");
const path = require("path");

// ── Paths ─────────────────────────────────────────────────────────────────────
const SERIALS_FILE = path.join(__dirname, "..", "metadata", "serials.json");
const OUT_DIR      = path.join(__dirname, "..", "metadata", "tokens");
const IMAGE_BASE   = "https://pill-x.com/images";

if (!fs.existsSync(SERIALS_FILE)) {
  console.error("serials.json not found. Run `npm run generate:serials` first.");
  process.exit(1);
}

const serials = JSON.parse(fs.readFileSync(SERIALS_FILE, "utf8"));
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Tier definitions ─────────────────────────────────────────────────────────
const TIER_META = {
  common: {
    label:       "Common",
    description: "PILL-X Common Edition — a physical digital asset with NFC twin. Each pill contains a unique NFC chip linked to this NFT on the blockchain.",
    priceUSD:    1000,
    image:       `${IMAGE_BASE}/pill-common.png`,
    attributes: [
      { trait_type: "Tier",      value: "Common"    },
      { trait_type: "Edition",   value: "Standard"  },
      { trait_type: "Price USD", value: 1000        },
      { trait_type: "NFT Drop",  value: "None"      },
    ],
  },
  premium: {
    label:       "Premium",
    description: "PILL-X Premium Edition — physical digital asset with NFC twin and exclusive NFT drop included. Unlock rare digital collectibles with your pill.",
    priceUSD:    2500,
    image:       `${IMAGE_BASE}/pill-premium.png`,
    attributes: [
      { trait_type: "Tier",      value: "Premium"   },
      { trait_type: "Edition",   value: "Premium"   },
      { trait_type: "Price USD", value: 2500        },
      { trait_type: "NFT Drop",  value: "Included"  },
    ],
  },
  gold: {
    label:       "Gold",
    description: "PILL-X Gold Edition — ultra-rare physical digital asset with NFC twin, special NFT drop, and integrated Gold-tier exclusive experience. Only 2,500 ever made.",
    priceUSD:    5000,
    image:       `${IMAGE_BASE}/pill-gold.png`,
    attributes: [
      { trait_type: "Tier",      value: "Gold"          },
      { trait_type: "Edition",   value: "Ultra Rare"    },
      { trait_type: "Price USD", value: 5000            },
      { trait_type: "NFT Drop",  value: "Special Drop"  },
    ],
  },
};

// ── Generator ────────────────────────────────────────────────────────────────
let total = 0;

for (const [tierName, entries] of Object.entries(serials)) {
  const meta = TIER_META[tierName];
  if (!meta) { console.warn(`Unknown tier: ${tierName}`); continue; }

  for (const entry of entries) {
    const { tokenId, serial, nfcUri } = entry;

    const tokenMeta = {
      name:        `PILL-X #${tokenId} — ${meta.label}`,
      description: meta.description,
      image:       meta.image,
      external_url:`https://pill-x.com/pill/${tokenId}`,
      attributes: [
        ...meta.attributes,
        { trait_type: "Token ID",        value: tokenId                      },
        { trait_type: "NFC Serial",      value: serial                       },
        { trait_type: "NFC Verify URL",  value: nfcUri                       },
        { trait_type: "Physical Asset",  value: "Yes"                        },
        { trait_type: "Blockchain Twin", value: "Yes"                        },
        { trait_type: "Supply",          value: meta.label === "Common" ? 30000 : meta.label === "Premium" ? 7500 : 2500 },
      ],
      nfc: {
        serial,
        verifyUrl: nfcUri,
        standard:  "NFC-UID7",
      },
    };

    fs.writeFileSync(
      path.join(OUT_DIR, `${tokenId}.json`),
      JSON.stringify(tokenMeta, null, 2)
    );
    total++;
  }

  console.log(`  ${tierName}: ${entries.length} metadata files written`);
}

console.log(`\nDone! ${total} metadata files saved to ${OUT_DIR}`);
