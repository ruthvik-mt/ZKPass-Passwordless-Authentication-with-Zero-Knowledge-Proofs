# ZKPass SDK

Official SDK for ZKPass - Zero Knowledge Password Authentication System. This SDK provides a simple and secure way to integrate ZKPass authentication into your applications.

## Installation

```bash
npm install zkpass-sdk
# or
yarn add zkpass-sdk
```

## Testing the SDK

To run the test suite and verify the SDK functionality, use the following command in the SDK directory:

```bash
npm test
```

This will run all Jest tests located in the `src/__tests__/` directory. You should see output indicating that all tests have passed if the SDK is working correctly.

## Integration Guide

### Backend Integration

1. **Install the SDK:**
   ```bash
   npm install zkpass-sdk
   ```

2. **Initialize the SDK:**
   ```typescript
   import { ZKPassClient } from 'zkpass-sdk';

   // Create an instance of ZKPassClient
   const client = new ZKPassClient({
     baseURL: 'http://localhost:3001', // Your backend URL
   });
   ```

3. **Use in Your Routes/Controllers:**
   ```typescript
   // Example: User Registration Route
   app.post('/register', async (req, res) => {
     try {
       const { uid } = req.body;
       const response = await client.register(uid);
       res.status(201).json(response);
     } catch (error) {
       res.status(500).json({ 
         success: false, 
         message: error.message 
       });
     }
   });

   // Example: User Login Route
   app.post('/login', async (req, res) => {
     try {
       const { uid } = req.body;
       const response = await client.login(uid);
       res.status(200).json(response);
     } catch (error) {
       res.status(401).json({ 
         success: false, 
         message: error.message 
       });
     }
   });

   // Example: Recovery Phrase Verification Route
   app.post('/verify-recovery', async (req, res) => {
     try {
       const { recoveryPhrase } = req.body;
       const response = await client.verifyRecovery(recoveryPhrase);
       res.status(200).json(response);
     } catch (error) {
       res.status(400).json({ 
         success: false, 
         message: error.message 
       });
     }
   });
   ```

### Frontend Integration

1. **Install the SDK:**
   ```bash
   npm install zkpass-sdk
   ```

2. **Initialize the SDK:**
   ```typescript
   import { ZKPassClient } from 'zkpass-sdk';

   // Create an instance of ZKPassClient
   const client = new ZKPassClient({
     baseURL: 'http://localhost:3001', // Your backend URL
   });
   ```

3. **Use in Your Components:**
   ```typescript
   // Example: Registration Component
   async function handleRegister(uid: string) {
     try {
       const response = await client.register(uid);
       // Store recovery phrase securely
       console.log('Recovery phrase:', response.recoveryPhrase);
       // Show success message to user
     } catch (error) {
       // Handle error
       console.error('Registration failed:', error.message);
     }
   }

   // Example: Login Component
   async function handleLogin(uid: string) {
     try {
       const response = await client.login(uid);
       // Handle successful login
       console.log('Login successful:', response.uid);
     } catch (error) {
       // Handle error
       console.error('Login failed:', error.message);
     }
   }

   // Example: Recovery Component
   async function handleRecovery(recoveryPhrase: string) {
     try {
       const response = await client.verifyRecovery(recoveryPhrase);
       // Handle successful recovery
       console.log('Recovery successful:', response.uid);
       console.log('Public key:', response.publicKey);
     } catch (error) {
       // Handle error
       console.error('Recovery failed:', error.message);
     }
   }
   ```

## API Reference

### Configuration

```typescript
interface ZKPassConfig {
  baseURL: string;    // Required: Your backend URL
  timeout?: number;   // Optional: Request timeout in milliseconds
}
```

### Methods

#### register(uid: string): Promise<RegisterResponse>

Register a new user with a unique identifier.

```typescript
interface RegisterResponse {
  success: boolean;
  message: string;
  recoveryPhrase: string;
}
```

#### login(uid: string): Promise<LoginResponse>

Login with a user's unique identifier.

```typescript
interface LoginResponse {
  success: boolean;
  message: string;
  uid: string;
}
```

#### verifyRecovery(recoveryPhrase: string): Promise<VerifyRecoveryResponse>

Verify a recovery phrase and derive the associated UID.

```typescript
interface VerifyRecoveryResponse {
  success: boolean;
  message: string;
  uid: string;
  publicKey: string;
}
```

### Error Handling

The SDK uses a custom `ZKPassError` class for error handling:

```typescript
try {
  await client.register('user123');
} catch (error) {
  if (error instanceof ZKPassError) {
    console.error('Error message:', error.message);
  }
}
```

## Security Considerations

1. Always store the recovery phrase securely
2. Use HTTPS for all API communications
3. Implement proper error handling in your application
4. Keep your backend URL secure and only expose necessary endpoints

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
