import express from 'express'
import { ZKPassClient } from 'zkpass-sdk'

const router = express.Router()
const sdk = new ZKPassClient({
  environment: 'development',
  baseURL: 'http://localhost:3001/api'
})

// In-memory storage for users
const users: { [key: string]: { uid: string; recoveryPhrase: string; publicKey: string } } = {}

router.post('/register', async (req, res) => {
  const { uid } = req.body

  if (!uid) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing UID' 
    })
  }

  if (users[uid]) {
    return res.status(400).json({ 
      success: false, 
      message: 'UID already exists' 
    })
  }

  try {
    const response = await sdk.register(uid)
    res.json(response)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Registration failed' 
    })
  }
})

router.post('/login', async (req, res) => {
  const { uid } = req.body

  if (!uid) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing UID' 
    })
  }

  if (!users[uid]) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid UID' 
    })
  }

  try {
    const response = await sdk.login(uid)
    res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Login failed' 
    })
  }
})

router.post('/verify-recovery', async (req, res) => {
  const { recoveryPhrase } = req.body

  if (!recoveryPhrase) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing recovery phrase' 
    })
  }

  const user = Object.values(users).find(u => u.recoveryPhrase === recoveryPhrase)

  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid recovery phrase' 
    })
  }

  try {
    const response = await sdk.verifyRecovery(recoveryPhrase)
    res.json(response)
  } catch (error) {
    console.error('Recovery verification error:', error)
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Recovery verification failed' 
    })
  }
})

export { router as authRouter } 