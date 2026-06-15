const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const aiRouter = require('./routes/ai')

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/ai', aiRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Backend running' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
