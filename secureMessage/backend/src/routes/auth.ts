import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// In-memory storage for users
const users: { [key: string]: { uid: string; recoveryPhrase: string; publicKey: string } } = {}

router.post('/auth/register', (req, res) => {
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

  // Generate a recovery phrase (using UUID for simplicity)
  const recoveryPhrase = uuidv4().split('-')[0]
  // Generate a mock public key (in real implementation, this would be derived from the recovery phrase)
  const publicKey = `0x${uuidv4().replace(/-/g, '')}`

  users[uid] = { uid, recoveryPhrase, publicKey }
  res.json({ 
    success: true, 
    message: 'Registration successful',
    recoveryPhrase
  })
})

router.post('/auth/login', (req, res) => {
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

  res.json({ 
    success: true, 
    message: 'Login successful',
    uid: users[uid].uid
  })
})

router.post('/auth/verify-recovery', (req, res) => {
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

  res.json({ 
    success: true, 
    message: 'Recovery successful',
    uid: user.uid,
    publicKey: user.publicKey
  })
})

export { router as authRouter } 