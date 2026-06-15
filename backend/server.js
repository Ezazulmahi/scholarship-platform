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
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const BASE_URL = `http://localhost:${PORT}`

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

// ================= ROUTES =================
app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/ai', aiRouter)

// AI recommendation bridge (Python service)
app.post('/api/recommend', async (req, res) => {
  try {
    const { data } = await axios.post('http://localhost:8000/recommend', req.body)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend running successfully 🚀',
    url: BASE_URL
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Supabase test route
app.get('/test', async (req, res) => {
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
})

// DB check on startup
const testDBConnection = async () => {
  const { error } = await supabase
    .from('users')
    .select('*')
    .limit(1)

  if (error) {
    console.log('❌ Database connection failed:', error.message)
  } else {
    console.log('✅ Database connected successfully')
  }
}

// START SERVER
app.listen(PORT, async () => {
  console.log(`🚀 Server running at: ${BASE_URL}`)
  await testDBConnection()
})