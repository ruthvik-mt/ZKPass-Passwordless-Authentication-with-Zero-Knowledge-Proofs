pragma circom 2.0.0;

/*
 * Login circuit for ZKPass
 * This circuit verifies that the user knows the private key derived from their UID
 * without revealing the private key itself.
 */

// Include necessary circomlib components
include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template Login() {  // Changed from `LoginCircuit()` to `Login()` (best practice)
    // Private inputs
    signal input privateKey; // The private key derived from UID
    
    // Public inputs
    signal input publicUID; // The public UID
    
    // Output
    signal output isValid; // 1 if the private key is valid for the UID, 0 otherwise
    
    // Compute the hash of the private key
    component hasher = Poseidon(1);
    hasher.inputs[0] <== privateKey;
    
    // Compare the hash with the expected value derived from the public UID
    component comparator = IsEqual();
    comparator.in[0] <== hasher.out;
    comparator.in[1] <== publicUID;
    
    // Set the output
    isValid <== comparator.out;
}

component main { public [publicUID] } = Login();  // Added `public [publicUID]` for Groth16