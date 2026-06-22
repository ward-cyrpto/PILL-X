import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PILL-X — Physical Digital Asset | NFC NFT Twins",
  description:
    "PILL-X: Own a physical pill with an embedded NFC chip that is permanently linked to your NFT on every major blockchain. 40,000 pills. Three exclusive tiers.",
  metadataBase: new URL("https://pill-x.com"),
  openGraph: {
    title: "PILL-X — The Physical Digital Asset",
    description: "40,000 NFC-chipped pills. Each one a unique NFT twin on every blockchain.",
    url: "https://pill-x.com",
    siteName: "PILL-X",
    images: [{ url: "/images/og-banner.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PILL-X",
    description: "Physical Digital Asset | NFC NFT Twin",
    images: ["/images/og-banner.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-white antialiased">{children}</body>
    </html>
  );
}
