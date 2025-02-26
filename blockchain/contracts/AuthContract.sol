// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuthContract {
    // Mapping to store verified public keys (e.g., Ethereum addresses)
    mapping(address => bool) public verifiedUsers;

    // Event to log when a user is verified
    event UserVerified(address indexed user);

    // Function to verify a user using ZKP
    function verifyUser(address user) public {
        require(!verifiedUsers[user], "User already verified");
        verifiedUsers[user] = true;
        emit UserVerified(user);
    }

    // Function to check if a user is verified
    function isVerified(address user) public view returns (bool) {
        return verifiedUsers[user];
    }
}