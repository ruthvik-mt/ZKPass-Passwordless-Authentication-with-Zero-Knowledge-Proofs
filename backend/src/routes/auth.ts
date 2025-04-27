import { Router } from 'express';
import { register, login, verifyRecoveryPhrase } from '../controllers/auth';

const router = Router();

// Register a new user with UID
router.post('/register', register);

// Login with UID and ZKP proof
router.post('/login', login);

// Verify recovery phrase and derive UID
router.post('/verify-recovery', verifyRecoveryPhrase);

export default router;