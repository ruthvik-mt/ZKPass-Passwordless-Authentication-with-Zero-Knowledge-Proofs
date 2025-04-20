// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ZKPassRegistry
 * @dev Contract for storing UIDs for the ZKPass authentication system
 */
contract ZKPassRegistry {
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
}