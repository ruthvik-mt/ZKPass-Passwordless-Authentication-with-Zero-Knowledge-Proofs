import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying ZKPass contract...");

  // Get the contract factory
  const ZKPass = await ethers.getContractFactory("ZKPass");

  // Deploy the contract
  const zkPass = await ZKPass.deploy();
  await zkPass.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await zkPass.getAddress();
  console.log(`ZKPass deployed at: ${contractAddress}`);

  // Save address and ABI to deployment/ZKPass.json
  const deploymentInfo = {
    address: contractAddress,
    abi: ZKPass.interface.format("json"),
  };

  const outputPath = path.join(__dirname, "../deployment/ZKPass.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("Saved ABI and address to deployment/ZKPass.json");

  // Print .env tip
  console.log("\nAdd this to your .env file:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}  // ZKPass contract address`);
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
