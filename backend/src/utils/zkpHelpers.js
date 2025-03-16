import { generateProof, verifyProof } from "../services/zkpService.js";

/**
 * Generate a ZKP proof and verify it
 * @param {string} secret - User's secret
 * @param {string} hash - Hash of the secret
 * @returns {boolean} - True if the proof is valid, false otherwise
 */
export const generateAndVerifyProof = async (secret, hash) => {
  try {
    // Generate proof
    const { proof, publicSignals } = await generateProof(secret, hash);

    // Verify proof
    const isValid = await verifyProof(proof, publicSignals);
    return isValid;
  } catch (error) {
    console.error("Error in generateAndVerifyProof:", error);
    throw error;
  }
};