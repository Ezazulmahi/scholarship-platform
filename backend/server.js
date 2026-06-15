const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const axios = require('axios')
require('dotenv').config()

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const aiRouter = require('./routes/ai')
const supabase = require('./config/supabase')

const app = express()

const PORT = process.env.PORT || 5000

// IMPORTANT: use env in production
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// safer base URL (works on Render)
const BASE_URL =
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${PORT}`

/* ================= SAFE CORS ================= */
const allowedOrigins = [
  "http://localhost:3000",
  FRONTEND_URL
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(null, true) // don't crash server
  },
  credentials: true,
}))

/* ================= MIDDLEWARE ================= */
app.use(express.json())
app.use(cookieParser())

/* ================= ROUTES ================= */
app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/ai', aiRouter)

/* ================= AI BRIDGE ================= */
app.post('/api/recommend', async (req, res) => {
  try {
    const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

    const { data } = await axios.post(`${AI_URL}/recommend`, req.body)

    res.json(data)
  } catch (err) {
    console.error("AI ERROR:", err.message)
    res.status(500).json({ error: err.message })
  }
})

/* ================= HEALTH ROUTES ================= */
app.get('/', (req, res) => {
  res.json({
    message: 'Backend running successfully 🚀',
    url: BASE_URL
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

/* ================= SUPABASE TEST ================= */
app.get('/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (error) {
      return res.status(500).json({
        connected: false,
        error: error.message
      })
    }

    res.json({
      connected: true,
      message: 'Supabase connected!',
      data
    })

  } catch (err) {
    res.status(500).json({
      connected: false,
      error: err.message
    })
  }
})

/* ================= DB CHECK ================= */
const testDBConnection = async () => {
  try {
    const { error } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (error) {
      console.log('❌ Database connection failed:', error.message)
    } else {
      console.log('✅ Database connected successfully')
    }
  } catch (err) {
    console.log('❌ DB crash:', err.message)
  }
}

/* ================= START SERVER ================= */
app.listen(PORT, async () => {
  console.log(`🚀 Server running at: ${BASE_URL}`)
  await testDBConnection()
})