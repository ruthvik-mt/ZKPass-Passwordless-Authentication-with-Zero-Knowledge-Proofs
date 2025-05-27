# ZKPass SDK

A TypeScript SDK for interacting with the ZKPass authentication system. This SDK provides a simple interface for user registration, login, and recovery phrase verification.

## Installation

```bash
npm install zkpass-sdk
```

## Usage

```typescript
import { createZKPassClient } from 'zkpass-sdk';

// Initialize the client
const client = createZKPassClient({
  baseURL: 'http://your-api-url',
  apiKey: 'your-api-key' // Optional
});

// Register a new user
const registerResponse = await client.register('user123');
console.log('Recovery phrase:', registerResponse.recoveryPhrase);

// Login
const loginResponse = await client.login('user123');
console.log('Login successful:', loginResponse.success);

// Verify recovery phrase
const recoveryResponse = await client.verifyRecovery('your recovery phrase');
console.log('Recovered UID:', recoveryResponse.uid);
console.log('Public key:', recoveryResponse.publicKey);
```

## API Reference

### `createZKPassClient(config: ZKPassConfig)`

Creates a new ZKPass client instance.

#### Config Options

- `baseURL` (required): The base URL of your ZKPass API
- `apiKey` (optional): Your API key for authentication

### Methods

#### `register(uid: string): Promise<RegisterResponse>`

Registers a new user with the given UID.

#### `login(uid: string): Promise<LoginResponse>`

Logs in a user with the given UID.

#### `verifyRecovery(recoveryPhrase: string): Promise<VerifyRecoveryResponse>`

Verifies a recovery phrase and returns the associated UID and public key.

## Response Types

### RegisterResponse
```typescript
{
  success: boolean;
  message: string;
  recoveryPhrase: string;
}
```

### LoginResponse
```typescript
{
  success: boolean;
  message: string;
  uid: string;
}
```

### VerifyRecoveryResponse
```typescript
{
  success: boolean;
  message: string;
  uid: string;
  publicKey: string;
}
```

## Error Handling

The SDK uses Axios for HTTP requests. All API calls will throw an error if the request fails. You can catch these errors and handle them appropriately:

```typescript
try {
  const response = await client.register('user123');
} catch (error) {
  console.error('Registration failed:', error.message);
}
``` 