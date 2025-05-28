import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// In-memory storage for users
const users: { [key: string]: { uid: string; recoveryPhrase: string } } = {}

router.post('/register', (req, res) => {
  const { uid } = req.body

  if (!uid) {
    return res.status(400).json({ success: false, message: 'Missing UID' })
  }

  if (users[uid]) {
    return res.status(400).json({ success: false, message: 'UID already exists' })
  }

  // Generate a recovery phrase (using UUID for simplicity)
  const recoveryPhrase = uuidv4().split('-')[0]

  users[uid] = { uid, recoveryPhrase }
  res.json({ 
    success: true, 
    recoveryPhrase,
    message: 'Registration successful. Please save your recovery phrase.' 
  })
})

router.post('/login', (req, res) => {
  const { uid } = req.body

  if (!uid) {
    return res.status(400).json({ success: false, message: 'Missing UID' })
  }

  if (!users[uid]) {
    return res.status(401).json({ success: false, message: 'Invalid UID' })
  }

  res.json({ success: true })
})

router.post('/recover', (req, res) => {
  const { recoveryPhrase } = req.body

  if (!recoveryPhrase) {
    return res.status(400).json({ success: false, message: 'Missing recovery phrase' })
  }

  const user = Object.values(users).find(u => u.recoveryPhrase === recoveryPhrase)

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid recovery phrase' })
  }

  res.json({ success: true, uid: user.uid })
})

export { router as authRouter } 