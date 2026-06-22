import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/webhook
 * PayPal IPN / webhook endpoint.
 * Receives payment confirmation and triggers NFT minting.
 *
 * In production, replace the stub minting logic with your actual
 * smart contract interaction (e.g., using ethers.js server-side).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── PayPal order verification ─────────────────────────────────────────
    // In production: verify the webhook signature using PayPal SDK
    // and the PAYPAL_WEBHOOK_ID env variable.
    // Docs: https://developer.paypal.com/docs/api/webhooks/v1/

    const {
      event_type,
      resource,
    } = body;

    if (event_type !== "CHECKOUT.ORDER.APPROVED" && event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ status: "ignored", event_type }, { status: 200 });
    }

    const orderId    = resource?.id ?? "unknown";
    const amountObj  = resource?.purchase_units?.[0]?.amount ?? {};
    const amountUSD  = parseFloat(amountObj.value ?? "0");
    const buyerEmail = resource?.payer?.email_address ?? "";
    const walletAddr = resource?.purchase_units?.[0]?.custom_id ?? "";

    // ── Determine tier from amount ────────────────────────────────────────
    let tier: "common" | "premium" | "gold";
    if      (amountUSD >= 5000) tier = "gold";
    else if (amountUSD >= 2500) tier = "premium";
    else if (amountUSD >= 1000) tier = "common";
    else {
      return NextResponse.json({ error: "Payment amount does not match any tier" }, { status: 400 });
    }

    // ── TODO: Trigger NFT mint ────────────────────────────────────────────
    // 1. Pull the next available serial for this tier from the DB
    // 2. Call pillx.mint(tier, serial, { value: ethAmount }) on the contract
    //    using a server-side wallet (DEPLOYER_PRIVATE_KEY env var)
    // 3. Send confirmation email to buyerEmail with tokenId + tracking link
    console.log({
      event:      "pill_purchase",
      orderId,
      tier,
      amountUSD,
      buyerEmail,
      walletAddr,
      timestamp:  new Date().toISOString(),
    });

    return NextResponse.json({ status: "ok", orderId, tier });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
