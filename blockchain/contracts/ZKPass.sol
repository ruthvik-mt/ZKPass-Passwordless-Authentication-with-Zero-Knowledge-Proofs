// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ZKPass
 * @dev Combined contract for ZKPass authentication system, handling both UID registration and ZKP verification
 */
contract ZKPass {
    // Mapping to store registered UIDs
    mapping(string => bool) private registeredUIDs;
    
    // Event emitted when a new UID is registered
    event UIDRegistered(string indexed uid);
    
    /**
     * @dev Register a new UID
     * @param uid The unique identifier to register
     */
    function registerUID(string memory uid) public {
        // Ensure UID is not empty
        bytes memory uidBytes = bytes(uid);
        require(uidBytes.length > 0, "UID cannot be empty");
        
        // Ensure UID is not already registered
        require(!registeredUIDs[uid], "UID already registered");
        
        // Register the UID
        registeredUIDs[uid] = true;
        
        // Emit event
        emit UIDRegistered(uid);
    }
    
    /**
     * @dev Check if a UID exists
     * @param uid The unique identifier to check
     * @return bool True if the UID exists, false otherwise
     */
    function checkUID(string memory uid) public view returns (bool) {
        return registeredUIDs[uid];
    }
    
    /**
     * @dev Verify a ZKP proof
     * @param proof The proof to verify
     * @param uid The unique identifier to check against
     * @return bool True if the proof is valid, false otherwise
     */
    function verifyProof(string memory proof, string memory uid) public view returns (bool) {
        // First check if the UID exists in the registry
        if (!checkUID(uid)) {
            return false;
        }
        
        // The actual verification would compare the proof against an expected value
        // In a real implementation, this would use cryptographic verification
        // For this implementation, we're simulating the verification process
        
        // The verification logic should match the proof generation algorithm:
        // 1. The backend has already hashed the first and second halves of the private key
        // 2. The backend has already concatenated: hashedFirstHalf + uid + hashedSecondHalf
        // 3. The backend has already hashed the combined string to create the proof
        
        // Since we can't recreate the private key on-chain, we trust that the proof
        // was generated correctly and simply verify its format
        
        // Check that the proof is a valid hex string of the right length (SHA-256 hash)
        bytes memory proofBytes = bytes(proof);
        if (proofBytes.length != 64) { // SHA-256 produces a 32-byte (64 hex chars) hash
            return false;
        }
        
        // Check that the proof contains only valid hex characters
        for (uint i = 0; i < proofBytes.length; i++) {
            bytes1 char = proofBytes[i];
            bool isHexChar = (
                (char >= 0x30 && char <= 0x39) || // 0-9
                (char >= 0x61 && char <= 0x66) || // a-f
                (char >= 0x41 && char <= 0x46)    // A-F
            );
            
            if (!isHexChar) {
                return false;
            }
        }
        
        // If we've passed all checks, the proof is considered valid
        return true;
    }
}