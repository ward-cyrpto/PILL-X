#!/usr/bin/env node
/**
 * upload-to-kv.js
 * Uploads the serial → tokenId map to Cloudflare KV (PILL_SERIALS namespace).
 *
 * Prerequisites:
 *   npm install -g wrangler
 *   wrangler login
 *   node scripts/generate-serials.js   (creates metadata/serials.json)
 *
 * Usage:
 *   KV_NAMESPACE_ID=<your-kv-id> node scripts/upload-to-kv.js
 *
 * Note: Cloudflare KV bulk write supports up to 10,000 entries per request.
 *       This script batches the 40,000 entries into 4 requests.
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const os   = require("os");
const { execSync } = require("child_process");

const SERIALS_FILE    = path.join(__dirname, "..", "metadata", "serials.json");
const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID;
const BATCH_SIZE      = 10_000;

if (!KV_NAMESPACE_ID) {
  console.error("Error: KV_NAMESPACE_ID environment variable is required.");
  process.exit(1);
}

if (!fs.existsSync(SERIALS_FILE)) {
  console.error("serials.json not found. Run `npm run generate:serials` first.");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(SERIALS_FILE, "utf-8"));

// Flatten all tiers into [ { key: serial, value: tokenId } ]
const allPairs = [];
for (const entries of Object.values(db)) {
  for (const { serial, tokenId } of entries) {
    allPairs.push({ key: serial, value: String(tokenId) });
  }
}

console.log(`Total entries to upload: ${allPairs.length}`);

for (let i = 0; i < allPairs.length; i += BATCH_SIZE) {
  const batch    = allPairs.slice(i, i + BATCH_SIZE);
  const tmpFile  = path.join(os.tmpdir(), `kv-batch-${i}.json`);
  fs.writeFileSync(tmpFile, JSON.stringify(batch));

  console.log(`Uploading batch ${i / BATCH_SIZE + 1} (${batch.length} entries)…`);
  try {
    execSync(
      `wrangler kv:bulk put --namespace-id=${KV_NAMESPACE_ID} ${tmpFile}`,
      { stdio: "inherit" }
    );
  } catch (err) {
    fs.unlinkSync(tmpFile);
    console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, err.message);
    process.exit(1);
  }
  fs.unlinkSync(tmpFile);
}

console.log("Done! All serials uploaded to Cloudflare KV.");
