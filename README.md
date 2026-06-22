# PILL-X — Physical Digital Asset | NFC NFT Twins

> **40,000 pills. Three tiers. Every blockchain. One scan.**

PILL-X is a physical digital asset platform where each pill contains an embedded NFC chip permanently linked to a unique NFT across every major blockchain.

---

## Tiers

| Tier    | Supply  | Price    | Perks                                      |
|---------|---------|----------|--------------------------------------------|
| Common  | 30,000  | $1,000   | NFC chip, NFT twin, all blockchains        |
| Premium |  7,500  | $2,500   | Everything in Common + exclusive NFT drop  |
| Gold    |  2,500  | $5,000   | Everything in Premium + special integrated drop |

---

## Architecture

```
PILL-X/
├── contracts/          ← Solidity smart contract (ERC-721 + ERC-2981)
│   ├── PillX.sol
│   ├── hardhat.config.js
│   └── scripts/deploy.js
│
├── frontend/           ← Next.js 14 full-stack app
│   └── src/
│       ├── app/
│       │   ├── page.tsx                  ← Storefront
│       │   ├── verify/page.tsx           ← NFC verify page
│       │   ├── pill/[id]/page.tsx        ← NFT detail page
│       │   └── api/
│       │       ├── metadata/[tokenId]/   ← ERC-721 metadata endpoint
│       │       ├── verify/[serial]/      ← NFC serial lookup
│       │       └── payment/              ← PayPal webhook
│       ├── components/
│       └── lib/
│
├── scripts/            ← Generation utilities
│   ├── generate-serials.js   ← Creates 40,000 unique NFC serial numbers
│   ├── generate-metadata.js  ← Creates OpenSea-compatible JSON metadata
│   └── upload-to-kv.js       ← Uploads serials to Cloudflare KV
│
├── cloudflare/         ← Cloudflare configuration
│   ├── CLOUDFLARE_SETUP.md
│   └── nfc-worker.js   ← Edge Worker for NFC tap redirects
│
└── metadata/           ← Generated output (gitignored)
    ├── serials.json
    └── tokens/{tokenId}.json
```

---

## Quick Start

### 1. Install dependencies

```bash
# Root
npm install

# Frontend
cd frontend && npm install && cd ..

# Contracts
cd contracts && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in PAYPAL_CLIENT_ID, RPC URLs, deployer key, etc.
```

### 3. Generate NFC serials & metadata

```bash
npm run generate:serials    # → metadata/serials.json (40,000 unique serials)
npm run generate:metadata   # → metadata/tokens/*.json (40,000 metadata files)
```

### 4. Deploy smart contracts

```bash
# To Ethereum mainnet
cd contracts
npm run deploy:ethereum

# To Polygon
npm run deploy:polygon

# To BSC
npm run deploy:bsc

# To all supported chains
npm run deploy:avalanche
npm run deploy:arbitrum
npm run deploy:optimism
npm run deploy:base
```

Copy the deployed contract address into your `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 5. Run the frontend

```bash
npm run dev
# → http://localhost:3000
```

### 6. Upload NFC serials to Cloudflare KV (optional but recommended)

```bash
KV_NAMESPACE_ID=<your-kv-id> node scripts/upload-to-kv.js
```

Then deploy the `cloudflare/nfc-worker.js` Worker to handle NFC taps at the edge.

---

## Domains

| Domain                | Purpose                         |
|-----------------------|---------------------------------|
| `pill-x.com`          | Primary storefront & API        |
| `pillx.nextgen.com`   | Mirror / partner domain         |

Both domains are proxied through Cloudflare. See [`cloudflare/CLOUDFLARE_SETUP.md`](cloudflare/CLOUDFLARE_SETUP.md) for full DNS and configuration instructions.

---

## Blockchain Support

| Chain      | Symbol | Chain ID |
|------------|--------|----------|
| Ethereum   | ETH    | 1        |
| Polygon    | POL    | 137      |
| BNB Chain  | BNB    | 56       |
| Avalanche  | AVAX   | 43114    |
| Arbitrum   | ARB    | 42161    |
| Optimism   | OP     | 10       |
| Base       | BASE   | 8453     |

Deploy the contract to each chain using the scripts above. The metadata URI
(`https://pill-x.com/api/metadata/<tokenId>`) is chain-agnostic.

---

## API Endpoints

| Method | Path                          | Description                          |
|--------|-------------------------------|--------------------------------------|
| GET    | `/api/metadata/:tokenId`      | ERC-721 metadata JSON                |
| GET    | `/api/verify/:serial`         | Look up a pill by NFC serial number  |
| POST   | `/api/payment`                | PayPal webhook — triggers NFT mint   |

---

## Payment Flow

1. Buyer selects a tier on `pill-x.com`
2. PayPal checkout opens — payment sent directly to `warddavis030-4@gmail.com`
3. PayPal webhook fires `POST /api/payment`
4. Server assigns an NFC serial and calls `pillx.mint()` on the contract
5. NFT appears in buyer's wallet
6. Physical pill ships with NFC chip pre-programmed to `https://pill-x.com/nfc/<serial>`

---

## NFC Chip URL Format

Each physical pill's NFC chip is programmed with:
```
https://pill-x.com/nfc/<SERIAL>
```

When tapped, Cloudflare Worker resolves the serial to the tokenId and redirects
the user to `https://pill-x.com/pill/<tokenId>` — the NFT detail page.

---

## Smart Contract

**PillX.sol** — ERC-721 with ERC-2981 royalties (5% on secondary sales)

Key functions:
- `mint(tier, serial)` — public mint by paying tier price
- `ownerMint(to, tier, serial)` — owner-only free mint
- `setTierPrice(tier, priceWei)` — update price per chain
- `nfcSerial(tokenId)` — get NFC serial for a token
- `serialToToken(serial)` — reverse lookup: serial → tokenId

---

## License

MIT © PILL-X
