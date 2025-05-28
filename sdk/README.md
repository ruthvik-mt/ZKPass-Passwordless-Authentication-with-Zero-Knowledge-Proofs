# ZKPass SDK

A secure authentication SDK for web applications that provides zero-knowledge proof-based authentication services.

## Installation

```bash
npm install zkpass-sdk
```

## Quick Start

```typescript
import { createZKPassClient } from 'zkpass-sdk';

// Initialize the client
const zkpass = createZKPassClient({
  environment: 'production', // or 'development', 'staging'
  apiKey: 'your-api-key'    // optional
});

// Register a new user
try {
  const registerResult = await zkpass.register('user123');
  console.log('Recovery phrase:', registerResult.recoveryPhrase);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login
try {
  const loginResult = await zkpass.login('user123');
  console.log('Login successful:', loginResult.uid);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Verify recovery phrase
try {
  const verifyResult = await zkpass.verifyRecovery('your-recovery-phrase');
  console.log('Recovery verified:', verifyResult.uid);
} catch (error) {
  console.error('Recovery verification failed:', error.message);
}
```

## Configuration

The SDK can be configured with the following options:

```typescript
interface ZKPassConfig {
  environment?: 'development' | 'staging' | 'production';
  baseURL?: string;
  apiKey?: string;
}
```

- `environment`: Choose between 'development', 'staging', or 'production' environments
- `baseURL`: Custom API endpoint URL (overrides environment setting)
- `apiKey`: Your API key for authentication (optional)

## API Reference

### register(uid: string)
Registers a new user with the provided UID.
- Returns: `Promise<RegisterResponse>`
- Throws: `ZKPassError` if registration fails

### login(uid: string)
Authenticates a user with the provided UID.
- Returns: `Promise<LoginResponse>`
- Throws: `ZKPassError` if login fails

### verifyRecovery(recoveryPhrase: string)
Verifies a recovery phrase and returns associated user details.
- Returns: `Promise<VerifyRecoveryResponse>`
- Throws: `ZKPassError` if verification fails

## Error Handling

The SDK uses a custom `ZKPassError` class for error handling:

```typescript
try {
  await zkpass.login('user123');
} catch (error) {
  if (error instanceof ZKPassError) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}
```

## Environment URLs

- Development: `http://localhost:3000`
- Staging: `https://staging-api.zkpass.com`
- Production: `https://api.zkpass.com`

## Security

- All API calls are made over HTTPS
- API key authentication is supported
- Zero-knowledge proof based authentication
- Secure recovery phrase system

## Support

For support, please contact support@zkpass.com or open an issue in our GitHub repository.

## License

MIT 