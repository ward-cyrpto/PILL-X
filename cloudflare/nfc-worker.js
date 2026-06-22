/**
 * PILL-X Cloudflare Worker — NFC Serial Redirect
 * Deploy at: https://pill-x.com/nfc/<serial>
 *
 * When a customer taps their PILL-X pill with an NFC-enabled phone,
 * the NFC chip fires a URL like: https://pill-x.com/nfc/A1B2C3D4E5F6
 * This Worker resolves the serial to a tokenId at the edge and redirects
 * the user to the pill's NFT page instantly — no origin round-trip needed
 * for the lookup (uses Cloudflare KV store for the serial → tokenId map).
 *
 * Setup:
 *   1. Create a KV namespace called PILL_SERIALS in Cloudflare dashboard
 *   2. Bind it to this Worker as PILL_SERIALS
 *   3. Populate KV with: serial → tokenId (run scripts/upload-to-kv.js)
 *   4. Deploy this Worker
 */

export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const serial = url.pathname.split("/nfc/")[1]?.toUpperCase().trim();

    if (!serial || !/^[0-9A-F]{12}$/.test(serial)) {
      return Response.redirect("https://pill-x.com/verify", 302);
    }

    // Look up tokenId from KV
    const tokenId = await env.PILL_SERIALS.get(serial);

    if (tokenId) {
      // Redirect to NFT detail page
      return Response.redirect(`https://pill-x.com/pill/${tokenId}`, 302);
    }

    // Serial not found — redirect to verify page with serial pre-filled
    return Response.redirect(`https://pill-x.com/verify/${serial}`, 302);
  },
};
