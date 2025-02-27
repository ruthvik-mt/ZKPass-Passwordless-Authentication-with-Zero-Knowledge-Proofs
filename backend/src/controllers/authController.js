import { generateAndVerifyProof } from "../utils/zkpHelpers.js";

/**
 * Handle ZKP-based authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const authenticate = async (req, res) => {
  const { secret, hash } = req.body;

  if (!secret || !hash) {
    return res.status(400).json({ message: "Secret and hash are required" });
  }

  try {
    // Generate and verify ZKP proof
    const isValid = await generateAndVerifyProof(secret, hash);

    if (isValid) {
      return res.status(200).json({ message: "Authentication successful" });
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    console.error("Error in authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};