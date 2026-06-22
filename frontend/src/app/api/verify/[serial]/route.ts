import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/**
 * GET /api/verify/[serial]
 * Look up a pill by its NFC serial number.
 * Returns tier, tokenId, NFT ownership info, and verify URL.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { serial: string } }
) {
  const serial = params.serial.toUpperCase().trim();

  if (!/^[0-9A-F]{12}$/.test(serial)) {
    return NextResponse.json({ error: "Invalid NFC serial format" }, { status: 400 });
  }

  // Load serials index
  const serialsFile = process.env.SERIALS_FILE || path.join(process.cwd(), "..", "metadata", "serials.json");

  if (!fs.existsSync(serialsFile)) {
    return NextResponse.json(
      { error: "Serial database not initialised. Run npm run generate:serials first." },
      { status: 503 }
    );
  }

  const db: Record<string, Array<{ tokenId: number; serial: string; nfcUri: string }>> =
    JSON.parse(fs.readFileSync(serialsFile, "utf-8"));

  for (const [tier, entries] of Object.entries(db)) {
    const entry = entries.find((e) => e.serial === serial);
    if (entry) {
      return NextResponse.json({
        found:    true,
        serial,
        tier,
        tokenId:  entry.tokenId,
        nfcUri:   entry.nfcUri,
        nftUrl:   `https://pill-x.com/pill/${entry.tokenId}`,
        openseaUrl: `https://opensea.io/assets/ethereum/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "TBD"}/${entry.tokenId}`,
      });
    }
  }

  return NextResponse.json({ found: false, serial }, { status: 404 });
}
