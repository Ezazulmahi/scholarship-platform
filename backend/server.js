require('dotenv').config()

const PORT = process.env.PORT || 5000
const BASE_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`

const missing = ['JWT_SECRET', 'SUPABASE_URL', 'SUPABASE_KEY'].filter((k) => !process.env[k])
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}. See backend/.env.example.`)
  process.exit(1)
}

const { createApp } = require('./app')
const supabase = require('./config/supabase')
const { startAIKeepalive } = require('./controllers/aiController')

async function testDBConnection() {
  try {
    const { error } = await supabase.from('users').select('id', { head: true, count: 'exact' })
    if (error) console.log('Database connection failed:', error.message)
    else console.log('Database connected')
  } catch (err) {
    console.log('Database check crashed:', err.message)
  }
}

createApp().listen(PORT, async () => {
  console.log(`Server running at: ${BASE_URL}`)
  await testDBConnection()
  startAIKeepalive()
})
