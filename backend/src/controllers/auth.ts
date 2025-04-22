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
// Word map for recovery phrases (2-6 character words)
const WORD_MAP: Record<string, string[]> = {
  'a': ['tO', 'ANd', 'waS'], 'b': ['miX', 'oN', 'FaR'], 'c': ['PlAy', 'neW', 'wAy'],
  'd': ['loT', 'sWiM', 'BeT'], 'e': ['tAG', 'mUSt', 'foX'], 'f': ['HaT', 'CrY', 'UNdO'],
  'g': ['jaR', 'wiTH', 'eVeN'], 'h': ['grOw', 'BAcK', 'soN'], 'i': ['kEy', 'liST', 'DeW'],
  'j': ['rUSt', 'PeT', 'hUG'], 'k': ['JuST', 'NoW', 'wET'], 'l': ['aNy', 'RoPe', 'dAb'],
  'm': ['DUcK', 'zip', 'FOr'], 'n': ['FeW', 'lOOk', 'ViA'], 'o': ['NoR', 'tAp', 'oVer'],
  'p': ['SeW', 'wHiT', 'BuG'], 'q': ['TrY', 'hoP', 'dIg'], 'r': ['ClIP', 'rAw', 'iTEm'],
  's': ['pAy', 'StOp', 'oLd'], 't': ['ExT', 'gOaL', 'TrAp'], 'u': ['sEt', 'lAb', 'iNIt'],
  'v': ['NOdE', 'saY', 'UnDo'], 'w': ['InK', 'PrY', 'HIdE'], 'x': ['ArE', 'JoB', 'VeIl'],
  'y': ['sOUp', 'KnOw', 'mUd'], 'z': ['pEaR', 'BlOw', 'EnD'],
  
  'A': ['FoG', 'sKiP', 'RAn'], 'B': ['MaP', 'sOLd', 'fUr'], 'C': ['VAn', 'HeAt', 'sNeE'],
  'D': ['lEg', 'tOaD', 'sUN'], 'E': ['bIG', 'yAWn', 'drAw'], 'F': ['nAP', 'RoB', 'lAd'],
  'G': ['oMEgA', 'BuN', 'zOo'], 'H': ['yEt', 'ClAW', 'dOt'], 'I': ['tOrCh', 'iCOn', 'dEW'],
  'J': ['mEEt', 'sHaDE', 'dO'], 'K': ['iNvY', 'sUm', 'qUAd'], 'L': ['CrAnE', 'FuR', 'OpEn'],
  'M': ['gOAt', 'dIP', 'nEt'], 'N': ['HUrL', 'wAx', 'RoW'], 'O': ['sAGe', 'TrEE', 'wAr'],
  'P': ['ZIp', 'LeD', 'KnEe'], 'Q': ['yOU', 'jOkE', 'hEw'], 'R': ['vIsA', 'Ox', 'rAt'],
  'S': ['pIn', 'cUp', 'aLl'], 'T': ['zEN', 'pOd', 'sHaL'], 'U': ['lId', 'oGRe', 'JAzZ'],
  'V': ['aGE', 'rAnK', 'sUN'], 'W': ['tEE', 'jAW', 'uSE'], 'X': ['BiT', 'VEnD', 'OwL'],
  'Y': ['hUB', 'tOy', 'eGO'], 'Z': ['dUsT', 'aCT', 'ViN'],
  
  '0': ['OpE', 'bOX', 'nOb'], '1': ['TrY', 'bEd', 'LeT'], '2': ['mYth', 'JoT', 'eAr'],
  '3': ['sAW', 'GAlA', 'FuN'], '4': ['CrY', 'dAy', 'HIgh'], '5': ['pLaN', 'OwN', 'MoN'],
  '6': ['lAmP', 'PoD', 'fAD'], '7': ['vEt', 'oVE', 'dIP'], '8': ['JoB', 'VeST', 'OxY'],
  '9': ['wAy', 'fUNk', 'rEd'],
  
  '!': ['kEeN', 'CoP', 'sAd'], '@': ['QuE', 'mOb', 'HeN'], '#': ['sKiM', 'oRE', 'dIP'],
  '$': ['oWl', 'RaT', 'mIRo'], '%': ['bUD', 'pAY', 'FoRm'], '^': ['sTaG', 'gAP', 'HeY'],
  '&': ['nOrM', 'FiT', 'SoLo'], '*': ['kItE', 'DrIp', 'EnVy'], '(': ['lAp', 'RoW', 'pIg'],
  ')': ['JuG', 'MeGa', 'aCt'], '_': ['TiC', 'hAb', 'KnIt'], '+': ['ZoNE', 'GuM', 'LeW'],
  '-': ['gRoW', 'PAr', 'sAT'], '=': ['sOOn', 'cAsT', 'pRE'], '{': ['pILl', 'wOb', 'SaY'],
  '}': ['rEy', 'dOe', 'OwL'], '[': ['tOg', 'lInE', 'KiN'], ']': ['lAx', 'zIp', 'uRb'],
  '|': ['vIg', 'hEy', 'OpE'], '\\': ['bAd', 'dOnE', 'wIt'], ':': ['dOg', 'cAt', 'bIg'],
  ';': ['HiT', 'gUm', 'LoVe'], '"': ['eAr', 'sPy', 'yOw'], "'": ['nEeD', 'LiM', 'dAb'],
  '<': ['sUN', 'dIm', 'CaT'], '>': ['BaN', 'sIN', 'PrY'], ',': ['mAt', 'FuN', 'sAG'],
  '.': ['pOt', 'iCe', 'SpY'], '?': ['yELp', 'TrUe', 'sILo'], '/': ['wAr', 'sEE', 'hEn'],
  '~': ['MoP', 'tIp', 'yIn'], '`': ['jOg', 'sUb', 'ReW'], ' ': ['hOp', 'LoG', 'sAl']
};

// Track used words to prevent collisions
const usedWords = new Set<string>();

const generateRecoveryPhrase = (uid: string): string => {
  // Prepend secret salt to UID
  const saltedInput = SECRET_SALT + uid;
  
  // Generate phrase from salted UID using word map
  let phraseParts: string[] = [];
  
  for (let i = 0; i < saltedInput.length; i++) {
    const char = saltedInput[i];
    const words = WORD_MAP[char] || [];
    
    if (words.length > 0) {
      // Always use the first word variant for simplicity
      phraseParts.push(words[0]);
    }
  }
  
  return phraseParts.join(' ');
};

const deriveUIDFromRecoveryPhrase = (recoveryPhrase: string): string => {
  const words = recoveryPhrase.split(' ');
  let reconstructedInput = '';
  
  for (const word of words) {
    const char = Object.entries(WORD_MAP).find(([_, words]) => 
      words.includes(word)
    )?.[0] || '';
    reconstructedInput += char;
  }
  
  // Remove the prepended salt
  if (reconstructedInput.startsWith(SECRET_SALT)) {
    return reconstructedInput.slice(SECRET_SALT.length);
  }
  
  throw new Error('Invalid recovery phrase - salt mismatch');
};