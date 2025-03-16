// src/services/blockchainService.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const { ETHEREUM_RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

const AUTH_CONTRACT_ABI = [
  "function verifyUser(address user)",
  "function isVerified(address user) view returns (bool)",
];

const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const authContract = new ethers.Contract(CONTRACT_ADDRESS, AUTH_CONTRACT_ABI, signer);

export const verifyUserOnChain = async (userAddress) => {
  try {
    const tx = await authContract.verifyUser(userAddress);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    if (error.code === "INSUFFICIENT_FUNDS") {
      throw new Error("Insufficient funds for gas");
    } else if (error.code === "INVALID_ARGUMENT") {
      throw new Error("Invalid Ethereum address");
    } else {
      throw new Error("Failed to verify user on-chain");
    }
  }
};

export const isUserVerifiedOnChain = async (userAddress) => {
  try {
    const isVerified = await authContract.isVerified(userAddress);
    return isVerified;
  } catch (error) {
    throw new Error("Failed to check user verification");
  }
};