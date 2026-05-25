const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !FRONTEND_URL || origin === FRONTEND_URL) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
  })
)
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Backend running' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})