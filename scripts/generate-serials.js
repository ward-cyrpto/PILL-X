#!/usr/bin/env node
/**
 * generate-serials.js
 * Generates 40,000 unique NFC serial numbers for PILL-X pills.
 *
 * Output: scripts/serials.json  (tiered batches)
 *
 * Format: each serial is a 12-character uppercase hex string
 * (like a real NFC UID-7 or custom serial).
 *
 * Usage:
 *   node scripts/generate-serials.js
 */

"use strict";

const fs     = require("fs");
const path   = require("path");
const crypto = require("crypto");

// ── Config ──────────────────────────────────────────────────────────────────
const TIERS = [
  { name: "common",  count: 30_000, tokenStart: 1       },
  { name: "premium", count:  7_500, tokenStart: 30_001  },
  { name: "gold",    count:  2_500, tokenStart: 37_501  },
];

const SERIAL_LENGTH_BYTES = 6; // 6 bytes = 12 hex chars (like NFC UID-7 compact)

// ── Generator ────────────────────────────────────────────────────────────────
function generateUniqueSerials(total) {
  const seen = new Set();
  const serials = [];

  while (serials.length < total) {
    const buf = crypto.randomBytes(SERIAL_LENGTH_BYTES);
    const serial = buf.toString("hex").toUpperCase();
    if (!seen.has(serial)) {
      seen.add(serial);
      serials.push(serial);
    }
  }

  return serials;
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("Generating 40,000 unique NFC serial numbers...");

const totalNeeded = TIERS.reduce((s, t) => s + t.count, 0);
const allSerials  = generateUniqueSerials(totalNeeded);

const output = {};
let offset = 0;

for (const tier of TIERS) {
  const slice   = allSerials.slice(offset, offset + tier.count);
  output[tier.name] = slice.map((serial, i) => ({
    tokenId: tier.tokenStart + i,
    serial,
    nfcUri: `https://pill-x.com/verify/${serial}`,
  }));
  offset += tier.count;
  console.log(`  ${tier.name}: ${slice.length} serials generated (tokens ${tier.tokenStart}–${tier.tokenStart + tier.count - 1})`);
}

const outDir  = path.join(__dirname, "..", "metadata");
const outFile = path.join(outDir, "serials.json");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(output, null, 2));

console.log(`\nDone! Saved to ${outFile}`);
console.log(`Total serials: ${allSerials.length}`);
