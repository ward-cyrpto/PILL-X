const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying PillX with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // ── Configuration ────────────────────────────────────────────────────────
  const BASE_METADATA_URI    = process.env.BASE_METADATA_URI    || "https://pill-x.com/api/metadata/";
  const PAYMENT_RECIPIENT    = process.env.PAYMENT_RECIPIENT    || deployer.address;

  // Prices in wei – override per chain via environment variables
  // Defaults represent approximate USD values at moderate gas costs;
  // the owner can update these on-chain with setTierPrice() after deployment.
  const COMMON_PRICE_WEI  = process.env.COMMON_PRICE_WEI  || ethers.parseEther("0.5").toString();   // ~$1000
  const PREMIUM_PRICE_WEI = process.env.PREMIUM_PRICE_WEI || ethers.parseEther("1.25").toString();  // ~$2500
  const GOLD_PRICE_WEI    = process.env.GOLD_PRICE_WEI    || ethers.parseEther("2.5").toString();   // ~$5000

  // ── Deploy ────────────────────────────────────────────────────────────────
  const PillX = await ethers.getContractFactory("PillX");
  const pillx = await PillX.deploy(
    BASE_METADATA_URI,
    PAYMENT_RECIPIENT,
    COMMON_PRICE_WEI,
    PREMIUM_PRICE_WEI,
    GOLD_PRICE_WEI
  );
  await pillx.waitForDeployment();

  const address = await pillx.getAddress();
  const network = hre.network.name;

  console.log(`\nPillX deployed to: ${address}`);
  console.log(`Network: ${network}`);
  console.log(`Transaction hash: ${pillx.deploymentTransaction().hash}`);

  // ── Save deployment info ───────────────────────────────────────────────────
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });

  const info = {
    network,
    address,
    deployer: deployer.address,
    paymentRecipient: PAYMENT_RECIPIENT,
    baseMetadataURI: BASE_METADATA_URI,
    prices: {
      common:  COMMON_PRICE_WEI,
      premium: PREMIUM_PRICE_WEI,
      gold:    GOLD_PRICE_WEI,
    },
    deployedAt: new Date().toISOString(),
    txHash: pillx.deploymentTransaction().hash,
  };

  const outFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(outFile, JSON.stringify(info, null, 2));
  console.log(`\nDeployment info saved to ${outFile}`);

  // ── Verify hint ────────────────────────────────────────────────────────────
  console.log(`\nTo verify on block explorer run:`);
  console.log(
    `npx hardhat verify --network ${network} ${address} ` +
    `"${BASE_METADATA_URI}" "${PAYMENT_RECIPIENT}" ` +
    `${COMMON_PRICE_WEI} ${PREMIUM_PRICE_WEI} ${GOLD_PRICE_WEI}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
