// src/controllers/authController.js
import { generateAndVerifyProof } from "../utils/zkpHelpers.js";
import { verifyUserOnChain, isUserVerifiedOnChain } from "../services/blockchainService.js";

/**
 * Handle ZKP-based authentication and on-chain verification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const authenticate = async (req, res) => {
  const { secret, hash, userAddress } = req.body;

  if (!secret || !hash || !userAddress) {
    return res.status(400).json({ message: "Secret, hash, and userAddress are required" });
  }

  try {
    // Step 1: Generate and verify ZKP proof
    const isValid = await generateAndVerifyProof(secret, hash);

    if (!isValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Step 2: Verify user on-chain
    await verifyUserOnChain(userAddress);

    // Step 3: Check if the user is verified on-chain
    const isVerifiedOnChain = await isUserVerifiedOnChain(userAddress);

    if (isVerifiedOnChain) {
      return res.status(200).json({ message: "Authentication and on-chain verification successful" });
    } else {
      return res.status(500).json({ message: "On-chain verification failed" });
    }
  } catch (error) {
    console.error("Error in authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};