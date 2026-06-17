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

// safer base URL (Render + local)
const BASE_URL =
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${PORT}`

// frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

/* ================= CORS ================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  FRONTEND_URL,
  'https://scholarship-platform-xi.vercel.app'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // don’t crash server in production
    return callback(null, true)
  },
  credentials: true
}))

/* ================= MIDDLEWARE ================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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

/* ================= HEALTH ================= */
app.get('/', (req, res) => {
  res.json({
    message: 'Backend running successfully 🚀',
    url: BASE_URL,
    status: 'ok'
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

const { startAIKeepalive } = require('./controllers/aiController')  // ← move to top

/* ================= START SERVER ================= */
app.listen(PORT, async () => {
  console.log(`🚀 Server running at: ${BASE_URL}`)
  await testDBConnection()
  startAIKeepalive()  // ← call inside listen callback
})