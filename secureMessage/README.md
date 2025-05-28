# Secure Message Encoder/Decoder

A web application that allows users to encode and decode messages using various methods (Base64, Caesar cipher, and ROT13). The application includes user authentication with UID and recovery phrase functionality.

## Features

- User authentication with UID
- Recovery phrase for UID recovery
- Message encoding/decoding with multiple methods:
  - Base64
  - Caesar cipher
  - ROT13
- Modern UI with Chakra UI
- TypeScript support

## Project Structure

```
secureMessage/
├── frontend/          # React + Vite frontend
└── backend/           # Express.js backend
```

## Setup

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Register with a UID and recovery phrase
2. Login with your UID
3. If you forget your UID, use the recovery phrase to recover it
4. Once logged in, you can:
   - Enter a message
   - Choose an encoding method
   - Encode or decode the message
   - View the result

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Vite
  - Chakra UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - TypeScript
  - CORS 