# ZKPass

ZKPass is a secure authentication system that uses Zero-Knowledge Proofs (ZKPs) to verify user identities without revealing sensitive information.

## How It Works (With ZKP Magic)

### Simple Example: Email & Password or userIdentity [we call it UID] (But with ZKP)
Imagine:
- Your **UID** = `Krishna678_INSTA@` (stored on blockchain).
- Your **priKey** = `hidden_password` (derived from UID, never stored).

#### Login Flow:
1. **You Claim**:  
   _"I’m `Krishna678_INSTA@` and know the secret `hidden_password`."  
2. **ZKP Proof**:  
   - Client generates a cryptographic **proof** using:  
     - `priKey` (derived from UID)  
     - **Proving Key** (pre-setup math puzzle)  
3. **Verification**:  
   - Backend checks the proof against:  
     - Your `UID` (from blockchain)  
     - **Verification Key** (math "lock")  
   - ✅ Valid? → Logged in! *(No secrets exposed)*  
   - ❌ Invalid? → Rejected.  

#### Why It's Secure:
- 🔒 **Zero-Knowledge**: Proof reveals nothing about `priKey`.  
- ⚡ **Fast**: Verification takes 1-2ms (even on-chain).  
- 🛡️ **Unfakeable**: Impossible to guess valid proof without `priKey`.  

*(Uses zk-SNARKs with Groth16 algorithm for optimal efficiency.)*

---
## Project Structure

The project is organized into several key components:

- **Frontend**: React application for user interface
- **Backend**: Express API for handling authentication requests
- **Blockchain**: Smart contracts for storing UIDs
- **ZKP**: Zero-Knowledge Proof circuits for secure authentication

## Features

- Secure user registration with UID
- Recovery phrase generation for account recovery
- Zero-Knowledge Proof-based login
- UID recovery using recovery phrase
- Blockchain storage of user identifiers

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Hardhat for blockchain development

### Installation

1. Clone the repository 

2. Install dependencies for each component:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Blockchain
cd ../blockchain
npm install

# ZKP
cd ../zkp
npm install
```

### Running the Application

#### Backend

```bash
cd backend
npm run dev
```

The backend server will start on http://localhost:3001

#### Frontend

```bash
cd frontend
npm run dev
```

The frontend development server will start on http://localhost:5173

#### Blockchain (Local Development)

```bash
cd blockchain
npx hardhat node
```

In another terminal, deploy the contract:

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
```

## Authentication Flow

### Registration

1. User enters a unique identifier (UID)
2. System generates a recovery phrase linked to the UID
3. UID is stored on the blockchain
4. User saves the recovery phrase securely

### Login

1. User enters their UID.
2. System derives a private key from the UID.
3. A Zero-Knowledge Proof is generated to verify the user knows the private key.
4. The proof is verified without revealing the private key.
5. If valid, the user is authenticated.

### Recovery

1. User enters their recovery phrase.
2. System derives the UID from the recovery phrase

## Security Considerations

- Private keys are never stored or transmitted anywhere
- Zero-Knowledge Proofs ensure secure authentication
- Recovery phrases should be stored securely by users
