const express = require('express')
const cors = require('cors')
require('dotenv').config()
const supabase = require('./config/supabase')
const axios = require('axios')
const app = express()

app.use(cors())
app.use(express.json())
app.post('/api/recommend', async (req, res) => {
  const { data } = await axios.post('http://localhost:8000/recommend', req.body)
  res.json(data)
})
const PORT = process.env.PORT || 5000
const BASE_URL = `http://localhost:${PORT}`

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend running successfully 🚀',
    url: BASE_URL
  })
})

/**
 * TEST DATABASE CONNECTION
 * NOTE: You MUST create "users" table in Supabase first
 */
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

// TEST ROUTE (optional API check)
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

// START SERVER
app.listen(PORT, async () => {
  console.log(`🚀 Server running at: ${BASE_URL}`)

  // check DB after server starts
  await testDBConnection()
})