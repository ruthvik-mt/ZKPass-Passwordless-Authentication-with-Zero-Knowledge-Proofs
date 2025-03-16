pragma circom 2.0.0; // Specify the Circom version

include "../node_modules/circomlib/circuits/poseidon.circom";

template Auth() {
    signal input secret;  // User's secret
    signal input hash;    // Hash of the secret
    signal output verified;

    // Hash function using Poseidon
    component hashChecker = Poseidon(1);
    hashChecker.inputs[0] <== secret;

    // Check if computed hash matches provided hash
    hashChecker.out === hash;

    // Output 1 if the hash matches, otherwise the circuit will fail
    verified <== 1;
}

component main = Auth();