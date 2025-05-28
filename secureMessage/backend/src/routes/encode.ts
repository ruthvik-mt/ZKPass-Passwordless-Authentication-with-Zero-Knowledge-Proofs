import express from 'express'

const router = express.Router()

// Base64 encoding/decoding
const base64Encode = (text: string): string => {
  return Buffer.from(text).toString('base64')
}

const base64Decode = (text: string): string => {
  return Buffer.from(text, 'base64').toString('utf-8')
}

// Caesar cipher encoding/decoding
const caesarEncode = (text: string, shift: number = 3): string => {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      if (code >= 65 && code <= 90) { // Uppercase
        return String.fromCharCode(((code - 65 + shift) % 26) + 65)
      }
      if (code >= 97 && code <= 122) { // Lowercase
        return String.fromCharCode(((code - 97 + shift) % 26) + 97)
      }
      return char
    })
    .join('')
}

const caesarDecode = (text: string, shift: number = 3): string => {
  return caesarEncode(text, 26 - shift)
}

// ROT13 encoding/decoding (special case of Caesar cipher with shift=13)
const rot13Encode = (text: string): string => {
  return caesarEncode(text, 13)
}

const rot13Decode = (text: string): string => {
  return rot13Encode(text) // ROT13 is its own inverse
}

router.post('/', (req, res) => {
  const { message, method, isEncoding } = req.body

  if (!message || !method) {
    return res.status(400).json({ success: false, message: 'Missing required fields' })
  }

  try {
    let result: string

    switch (method) {
      case 'base64':
        result = isEncoding ? base64Encode(message) : base64Decode(message)
        break
      case 'caesar':
        result = isEncoding ? caesarEncode(message) : caesarDecode(message)
        break
      case 'rot13':
        result = isEncoding ? rot13Encode(message) : rot13Decode(message)
        break
      default:
        return res.status(400).json({ success: false, message: 'Invalid encoding method' })
    }

    res.json({ success: true, result })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing message' })
  }
})

export { router as encodeRouter } 