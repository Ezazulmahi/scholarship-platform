const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const aiRouter = require('./routes/ai')

const app = express()

const PORT = process.env.PORT || 5000

// ✅ IMPORTANT: add your real frontend URLs here
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://scholarship-platform-xi.vercel.app'
]

// ✅ CORS FIX (production safe)
app.use(cors({
  origin: function (origin, callback) {
    // allow tools like postman or server-to-server requests
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('CORS blocked'))
    }
  },
  credentials: true
}))

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// routes
app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/ai', aiRouter)

// health check
app.get('/', (req, res) => {
  res.json({
    message: 'Backend running',
    status: 'ok'
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// error handler (VERY IMPORTANT for debugging)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})