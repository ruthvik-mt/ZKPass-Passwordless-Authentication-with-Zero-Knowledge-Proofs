import { Request, Response, RequestHandler } from 'express';
import crypto from 'crypto';
import { ethers } from 'ethers';
import * as snarkjs from 'snarkjs';
import { storeUIDOnBlockchain, checkUIDExists } from '../services/blockchain';
import { generateZKProof, verifyZKProof } from '../services/zkp';

// Secret salt for key derivation (should be in .env)
const SECRET_SALT = process.env.SECRET_SALT || 'zkpass_secret_salt_for_key_derivation';

/**
 * Register a new user with UID
 */
export const register: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      res.status(400).json({ success: false, message: 'UID is required' });
      return;
    }

    // Check if UID already exists
    const uidExists = await checkUIDExists(uid);
    if (uidExists) {
      res.status(400).json({ success: false, message: 'UID already exists' });
      return;
    }

    // Generate recovery phrase (deterministic from UID using SHA-256)
    const recoveryPhrase = generateRecoveryPhrase(uid);

    // Store UID on blockchain
    await storeUIDOnBlockchain(uid);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      recoveryPhrase
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

/**
 * Login with UID and ZKP proof
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { uid, proof } = req.body;

    if (!uid || !proof) {
      res.status(400).json({ success: false, message: 'UID and proof are required' });
      return;
    }

    // Check if UID exists on blockchain
    const uidExists = await checkUIDExists(uid);
    if (!uidExists) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Verify ZKP proof
    const isProofValid = await verifyZKProof(uid, proof);
    if (!isProofValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      uid
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

/**
 * Verify recovery phrase and derive UID
 */
export const verifyRecoveryPhrase: RequestHandler = async (req, res) => {
  try {
    const { recoveryPhrase } = req.body;

    if (!recoveryPhrase) {
      res.status(400).json({ success: false, message: 'Recovery phrase is required' });
      return;
    }

    // Derive UID from recovery phrase
    const uid = deriveUIDFromRecoveryPhrase(recoveryPhrase);

    // Check if UID exists on blockchain
    const uidExists = await checkUIDExists(uid);
    if (!uidExists) {
      res.status(404).json({ success: false, message: 'Invalid recovery phrase' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Recovery successful',
      uid
    });
  } catch (error) {
    console.error('Recovery error:', error);
    res.status(500).json({ success: false, message: 'Server error during recovery' });
  }
};

/**
 * Generate a recovery phrase from UID
 */
const generateRecoveryPhrase = (uid: string): string => {
  // Create a deterministic recovery phrase using SHA-256
  const hash = crypto.createHash('sha256').update(uid).digest('hex');
  
  // Convert to a more user-friendly format (e.g., groups of 4 characters)
  const formattedPhrase = hash.match(/.{1,4}/g)?.join('-') || hash;
  
  return formattedPhrase;
};

/**
 * Derive UID from recovery phrase
 */
const deriveUIDFromRecoveryPhrase = (recoveryPhrase: string): string => {
  // Remove any formatting (like hyphens) from the recovery phrase
  const cleanPhrase = recoveryPhrase.replace(/-/g, '');
  
  // For this implementation, we'll use the recovery phrase directly
  // In a real implementation, you might want to use a more sophisticated approach
  const uid = crypto.createHash('sha256').update(cleanPhrase).digest('hex');
  
  return uid;
};