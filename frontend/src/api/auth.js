// src/api/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

/**
 * Authenticate a user using ZKP and on-chain verification
 * @param {string} secret - User's secret
 * @param {string} hash - Hash of the secret
 * @param {string} userAddress - Ethereum address of the user
 * @returns {Object} - Response from the server
 */
export const authenticate = async (secret, hash, userAddress) => {
  try {
    const response = await axios.post(`${API_URL}/authenticate`, {
      secret,
      hash,
      userAddress,
    });
    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};