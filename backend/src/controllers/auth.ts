import { Request, Response, RequestHandler } from 'express';
import crypto from 'crypto';
import { ethers } from 'ethers';
import * as snarkjs from 'snarkjs';
import { storeUIDOnBlockchain, checkUIDExists } from '../services/blockchain';
import { WORD_MAP } from '../utils/wordMap';

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

    // Generate revoveryKey
    const revoveryKey = crypto.randomBytes(32).toString('hex');
    
    // Generate recovery phrase (using the new method)
    const recoveryPhrase = generateRecoveryPhrase(uid, revoveryKey);

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
 * Login with UID and generate ZKP proof
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      res.status(400).json({ success: false, message: 'UID is required' });
      return;
    }

    // Check if UID exists on blockchain
    const uidExists = await checkUIDExists(uid);
    if (!uidExists) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Derive privateKey from uid following the algorithm
    // 1. Reverse UID
    // 2. Take odd indices
    // 3. Append secret salt
    // 4. SHA-256 the result
    const privateKey = derivePrivateKey(uid);
    
    // Generate ZKP proof using uid and privateKey
    const { generateProof } = await import('../../zkp/proofGenerator');
    const proof = await generateProof(uid, privateKey);
    
    // Verify ZKP proof
    const { verifyProof } = await import('../../zkp/proofVerifier');
    const isProofValid = await verifyProof(proof, uid);
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
    const { uid, privateKey } = deriveUIDFromRecoveryPhrase(recoveryPhrase);

    // Check if UID exists on blockchain
    const uidExists = await checkUIDExists(uid);
    if (!uidExists) {
      res.status(404).json({ success: false, message: 'Invalid recovery phrase' });
      return;
    }

    // Get the public key from the private key
    const wallet = new ethers.Wallet(privateKey);
    const publicKey = wallet.address;

    res.status(200).json({
      success: true,
      message: 'Recovery successful',
      uid,
      publicKey
    });
  } catch (error) {
    console.error('Recovery error:', error);
    res.status(500).json({ success: false, message: 'Server error during recovery' });
  }
};

/**
 * Derive a private key from the UID
 */
function derivePrivateKey(uid: string): string {
  // Step 1: Reverse the UID
  const reversed = uid.split('').reverse().join('');

  // Step 2: Take characters at odd indices
  const oddChars = reversed
    .split('')
    .filter((_, index) => index % 2 === 1)
    .join('');

  // Step 3: Concatenate with a static salt (known only to you)
  const withSalt = oddChars + SECRET_SALT;

  // Step 4: SHA-256 the result
  const privateKey = crypto.createHash('sha256').update(withSalt).digest('hex');
  
  return privateKey;
}



/**
 * Generate a recovery phrase from UID and private key
 */
const generateRecoveryPhrase = (uid: string, revoveryKey: string): string => {
  // Take 3 random characters from the revoveryKey
  const recvKeyChar = revoveryKey.substring(0, 3);
  
  // Take 3 random characters from the salt
  const saltChars = SECRET_SALT.substring(0, 3);
  
  // Combine: recvKeyChar + uid + saltChars
  const combinedString = recvKeyChar + uid + saltChars;
  
  // Generate phrase from combined string using word map
  let phraseParts: string[] = [];
  
  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString[i];
    const words = WORD_MAP[char] || [];
    
    if (words.length > 0) {
      // Randomly select a word variant
      const randomIndex = Math.floor(Math.random() * words.length);
      phraseParts.push(words[randomIndex]);
    }
  }
  
  return phraseParts.join(' ');
};

/**
 * Derive UID and private key information from recovery phrase
 */
const deriveUIDFromRecoveryPhrase = (recoveryPhrase: string): { uid: string, privateKey: string } => {
  const words = recoveryPhrase.split(' ');
  let combinedString = '';
  
  for (const word of words) {
    let foundChar = '';
    // Search WORD_MAP to find which character's word list contains this word
    for (const [char, wordList] of Object.entries(WORD_MAP)) {
      const index = wordList.indexOf(word);
      if (index !== -1) {
        foundChar = char;
        break;
      }
    }
    combinedString += foundChar;
  }
  
  // The first 3 characters are from the private key
  const priKeyChars = combinedString.substring(0, 3);
  
  // The last 3 characters are from the salt
  const saltChars = combinedString.substring(combinedString.length - 3);
  
  // The middle part is the UID
  const uid = combinedString.substring(3, combinedString.length - 3);
  
  // Recreate a private key using the private key chars and derivation function
  // const publicKey = priKeyChars + uid; // Create a pseudo-public key
  const privateKey = derivePrivateKey(uid);
  
  // Ensure the private key is a valid hex string
  const validPrivateKey = /^[0-9a-fA-F]+$/.test(privateKey) 
    ? privateKey 
    : crypto.createHash('sha256').update(privateKey).digest('hex');
  
  return { uid, privateKey: validPrivateKey };
};