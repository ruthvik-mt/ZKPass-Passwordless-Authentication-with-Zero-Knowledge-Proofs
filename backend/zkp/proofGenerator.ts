import crypto from 'crypto';

/**
 * Generate a ZKP proof using the specified algorithm
 * 1. Take the first half and second half of privKey and hash them separately
 * 2. Concatenate the first half at beginning of uid and second half at last of uid
 * 3. Hash the combined string
 * 
 * @param uid User's unique identifier
 * @param privateKey User's private key
 * @returns The generated proof
 */
export const generateProof = async (uid: string, privateKey: string): Promise<string> => {
  try {
    // 1. Split the private key into two halves
    const halfLength = Math.floor(privateKey.length / 2);
    const firstHalf = privateKey.substring(0, halfLength);
    const secondHalf = privateKey.substring(halfLength);
    
    // Hash each half separately
    const hashedFirstHalf = crypto.createHash('sha256').update(firstHalf).digest('hex');
    const hashedSecondHalf = crypto.createHash('sha256').update(secondHalf).digest('hex');
    
    // 2. Concatenate: hashedFirstHalf + uid + hashedSecondHalf
    const combinedString = hashedFirstHalf + uid + hashedSecondHalf;
    
    // 3. Hash the combined string
    const proof = crypto.createHash('sha256').update(combinedString).digest('hex');
    
    return proof;
  } catch (error) {
    console.error('Error generating ZKP proof:', error);
    throw new Error('Failed to generate ZKP proof');
  }
};

/**
 * Prepare proof data for blockchain verification
 * This function formats the proof and uid in a way that can be sent to the blockchain
 * 
 * @param proof The generated proof
 * @param uid User's unique identifier
 * @returns Formatted proof data for blockchain verification
 */
export const prepareProofForVerification = (proof: string, uid: string): { proof: string, uid: string } => {
  return { proof, uid };
};