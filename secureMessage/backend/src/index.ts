import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth'
import { encodeRouter } from './routes/encode'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/encode', encodeRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 