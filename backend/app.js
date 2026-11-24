const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const aiRouter = require('./routes/ai')
const { createLimiters } = require('./middleware/rateLimit')

function allowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  return new Set([
    'http://localhost:3000',
    'http://localhost:5173',
    'https://scholarship-platform-xi.vercel.app',
    process.env.FRONTEND_URL,
    ...fromEnv,
  ].filter(Boolean))
}

function createApp() {
  const app = express()
  const origins = allowedOrigins()
  const { authLimiter, otpLimiter, aiLimiter } = createLimiters()

  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.has(origin)) return callback(null, true)
      return callback(null, false)
    },
    credentials: true,
  }))

  app.use(express.json({ limit: '100kb' }))
  app.use(express.urlencoded({ extended: true, limit: '100kb' }))
  app.use(cookieParser())

  app.use(['/auth/verify-otp', '/auth/reset-password', '/auth/forgot-password'], otpLimiter)
  app.use('/auth', authLimiter, authRouter)
  app.use('/profile', profileRouter)
  app.use('/ai', aiLimiter, aiRouter)

  app.get('/', (req, res) => {
    res.json({ message: 'Backend running', status: 'ok' })
  })

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Malformed JSON body' })
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request body too large' })
    }
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}

module.exports = { createApp }
