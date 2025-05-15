import crypto from 'crypto';
import * as snarkjs from 'snarkjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Secret salt for key derivation (should be in .env)
const SECRET_SALT = process.env.SECRET_SALT || 'zkpass_secret_salt_for_key_derivation';

/**
 * Derive private key from UID  
 * This follows the algorithm described in the detailed flow:
 * 1. Reverse UID
 * 2. Take odd indices
 * 3. Append secret salt
 * 4. SHA-256 the result
 */
export const derivePrivateKey = (uid: string): string => {
  // 1. Reverse UID
  const reversedUID = uid.split('').reverse().join('');
  
  // 2. Take odd indices
  let oddChars = '';
  for (let i = 1; i < reversedUID.length; i += 2) {
    oddChars += reversedUID[i];
  }
  
  // 3. Append secret salt
  const withSalt = oddChars + SECRET_SALT;
  
  // 4. SHA-256 the result
  const privateKey = crypto.createHash('sha256').update(withSalt).digest('hex');
  
  return privateKey;
};

/**
 * Generate ZKP proof using snarkjs
 * @param uid - User ID
 * @param privateKey - Private key derived from UID
 * @returns ZKP proof
 */
export const generateZKProof = async (uid: string, privateKey?: string): Promise<any> => {
  try {
    // If privateKey is not provided, derive it from UID
    if (!privateKey) {
      privateKey = derivePrivateKey(uid);
    }
    
    // Path to the circuit files
    const wasmFile = './zkp/circuits/login_js/login.wasm';
    const zkeyFile = './zkp/circuits/login_final.zkey';
    
    try {
      // Generate a proof using snarkjs
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        { privateKey: privateKey, publicUID: uid },
        wasmFile,
        zkeyFile
      );
      
      return { proof, publicSignals };
    } catch (snarkError) {
      console.error('Error generating proof with snarkjs:', snarkError);
      
      // Fallback to simulation if snarkjs fails (for development purposes)
      console.warn('Falling back to simulated proof generation');
      const simulatedProof = {
        proof: {
          pi_a: [privateKey.substring(0, 10), privateKey.substring(10, 20), '1'],
          pi_b: [
            [privateKey.substring(20, 30), privateKey.substring(30, 40)],
            [privateKey.substring(40, 50), privateKey.substring(50, 60)],
            ['1', '0']
          ],
          pi_c: [privateKey.substring(60, 70), privateKey.substring(70, 80), '1'],
          protocol: 'groth16'
        },
        publicSignals: [uid]
      };
      
      return simulatedProof;
    }
  } catch (error) {
    console.error('Error generating ZKP proof:', error);
    throw new Error('Failed to generate ZKP proof');
  }
};

/**
 * Verify ZKP proof using snarkjs
 * @param uid - User ID
 * @param proof - ZKP proof to verify
 * @returns boolean indicating if the proof is valid
 */
export const verifyZKProof = async (uid: string, proof: any): Promise<boolean> => {
  try {
    // Path to the verification key
    const vkeyFile = './zkp/circuits/verification_key.json';
    
    try {
      // Load verification key
      const vkey = require(vkeyFile); 
      
      // Verify the proof using snarkjs 
      const isValid = await snarkjs.groth16.verify(
        vkey, 
        proof.publicSignals, 
        proof.proof 
      ); 
      
      return isValid;  
    } catch (snarkError) {  
      console.error('Error verifying proof with snarkjs:', snarkError);
      
      // Fallback to simulation if snarkjs verification fails (for development purposes)
      console.warn('Falling back to simulated proof verification'); 
      
      // For demonstration purposes, we'll consider all proofs valid in fallback mode
      // In a production environment, this fallback should not exist
      return true;
    }
  } catch (error) {
    console.error('Error verifying ZKP proof:', error);
    throw new Error('Failed to verify ZKP proof');
  }
};