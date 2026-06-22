import { redirect } from "next/navigation";

/**
 * /verify/[serial]
 * NFC tap deep-link: the pill's NFC URL points here.
 * On scan, redirects to the verify page with the serial pre-filled,
 * or (if the serial resolves to a tokenId) directly to the pill NFT page.
 */
export default async function VerifySerialPage({ params }: { params: { serial: string } }) {
  const serial = params.serial.toUpperCase().trim();

  // Try to resolve the serial server-side
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res  = await fetch(`${base}/api/verify/${serial}`, { cache: "no-store" });
    const data = await res.json();
    if (data.found && data.tokenId) {
      redirect(`/pill/${data.tokenId}`);
    }
  } catch {
    // Fall through to the manual verify page
  }

  redirect(`/verify?serial=${serial}`);
}
