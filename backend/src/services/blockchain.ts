import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Blockchain configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// ABI for the ZKPassRegistry contract
const CONTRACT_ABI = [
  'function registerUID(string memory uid) public',
  'function checkUID(string memory uid) public view returns (bool)',
];

/**
 * Get provider and contract instance
 */
const getContract = async () => {
  try {
    // Create provider
    const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC_URL);
    
    // Get signer (for transactions that modify state)
    const signer = await provider.getSigner();
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS || '', CONTRACT_ABI, signer);
    
    return { provider, contract };
  } catch (error) {
    console.error('Error connecting to blockchain:', error);
    throw new Error('Failed to connect to blockchain');
  }
};

/**
 * Store UID on blockchain
 */
export const storeUIDOnBlockchain = async (uid: string): Promise<boolean> => {
  try {
    if (!CONTRACT_ADDRESS) {
      console.warn('Contract address not set. Simulating blockchain storage.');
      return true; // Simulate success for development
    }

    const { contract } = await getContract();
    
    // Register UID on blockchain
    const tx = await contract.registerUID(uid);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error storing UID on blockchain:', error);
    throw new Error('Failed to store UID on blockchain');
  }
};

/**
 * Check if UID exists on blockchain
 */
export const checkUIDExists = async (uid: string): Promise<boolean> => {
  try {
    if (!CONTRACT_ADDRESS) {
      console.warn('Contract address not set. Simulating blockchain check.');
      // For development, we'll consider UIDs that start with 'test' as existing
      return uid.startsWith('test');
    }

    const { contract } = await getContract();
    
    // Check if UID exists
    const exists = await contract.checkUID(uid);
    
    return exists;
  } catch (error) {
    console.error('Error checking UID on blockchain:', error);
    throw new Error('Failed to check UID on blockchain');
  }
};