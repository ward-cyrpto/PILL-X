import { redirect } from "next/navigation";

/**
 * /verify/[serial]
 * NFC tap deep-link: the pill's NFC URL points here.
 * On scan, redirects to the verify page with the serial pre-filled,
 * or (if the serial resolves to a tokenId) directly to the pill NFT page.
 */
export default async function VerifySerialPage({ params }: { params: { serial: string } }) {
  const serial = params.serial.toUpperCase().trim();

  // Require an explicit internal base URL; never guess in production.
  const internalBase = process.env.INTERNAL_API_BASE_URL;
  if (!internalBase) {
    // Cannot resolve serial server-side without config — fall back to client verify page
    redirect(`/verify?serial=${serial}`);
  }
  try {
    const res  = await fetch(`${internalBase}/api/verify/${serial}`, { cache: "no-store" });
    const data = await res.json();
    if (data.found && data.tokenId) {
      redirect(`/pill/${data.tokenId}`);
    }
  } catch {
    // Fall through to the manual verify page
  }

  redirect(`/verify?serial=${serial}`);
}
