import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TokenMeta {
  name:         string;
  description:  string;
  image:        string;
  external_url: string;
  attributes:   Array<{ trait_type: string; value: string | number }>;
  nfc:          { serial: string; verifyUrl: string; standard: string };
}

async function fetchMeta(id: string): Promise<TokenMeta | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/metadata/${id}`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const meta = await fetchMeta(params.id);
  if (!meta) return { title: "PILL-X" };
  return {
    title: meta.name,
    description: meta.description,
    openGraph: { title: meta.name, images: [meta.image] },
  };
}

export default async function PillPage({ params }: { params: { id: string } }) {
  const meta = await fetchMeta(params.id);
  if (!meta) notFound();

  const tier = meta.attributes.find((a) => a.trait_type === "Tier")?.value as string;
  const serial = meta.nfc?.serial ?? "";

  const TIER_STYLE: Record<string, string> = {
    Common:  "from-gray-500 to-gray-700",
    Premium: "from-purple-600 to-cyan-500",
    Gold:    "from-yellow-400 to-orange-500",
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar />

      <section className="flex-1 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className={`rounded-3xl bg-gradient-to-br ${TIER_STYLE[tier] || "from-gray-600 to-gray-800"} p-8 mb-8 flex items-center gap-6`}>
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl">
              💊
            </div>
            <div>
              <div className="text-white/70 text-sm uppercase tracking-widest font-semibold mb-1">PILL-X #{params.id}</div>
              <h1
                className="text-3xl font-black text-white"
                style={{ fontFamily: "var(--font-orbitron, monospace)" }}
              >
                {tier} Edition
              </h1>
              <p className="text-white/70 text-sm mt-1">{meta.description.slice(0, 120)}…</p>
            </div>
          </div>

          {/* Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {meta.attributes.map((attr) => (
              <div
                key={attr.trait_type}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{attr.trait_type}</div>
                <div className="text-white font-semibold text-sm truncate">{String(attr.value)}</div>
              </div>
            ))}
          </div>

          {/* NFC */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-purple-300 font-bold mb-4 flex items-center gap-2">
              📡 NFC Authentication
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Serial Number</div>
                <div className="font-mono text-white text-lg tracking-widest">{serial}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Standard</div>
                <div className="text-white">{meta.nfc?.standard}</div>
              </div>
            </div>
            <a
              href={meta.nfc?.verifyUrl}
              className="mt-4 inline-block px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
            >
              Verify on PILL-X →
            </a>
          </div>

          {/* External links */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://opensea.io/assets/ethereum/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "#"}/${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-white/30 text-sm font-semibold transition-colors"
            >
              OpenSea
            </a>
            <a
              href={meta.external_url}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-white/30 text-sm font-semibold transition-colors"
            >
              pill-x.com/pill/{params.id}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
