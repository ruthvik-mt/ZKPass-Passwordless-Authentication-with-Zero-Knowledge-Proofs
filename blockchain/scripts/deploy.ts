// Deployment script for ZKPassRegistry contract
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ZKPassRegistry contract...");

  // Get the contract factory
  const ZKPassRegistry = await ethers.getContractFactory("ZKPassRegistry");
  
  // Deploy the contract
  const zkPassRegistry = await ZKPassRegistry.deploy();
  
  // Wait for deployment to complete
  await zkPassRegistry.waitForDeployment();
  
  // Get the contract address
  const address = await zkPassRegistry.getAddress();
  
  console.log(`ZKPassRegistry deployed to: ${address}`);
  console.log("Add this address to your .env file as CONTRACT_ADDRESS");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });