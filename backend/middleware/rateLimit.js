const { rateLimit, ipKeyGenerator } = require('express-rate-limit')

const json = (message) => (req, res) => res.status(429).json({ error: message })

function createLimiters() {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.AUTH_RATE_LIMIT || 50),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: json('Too many requests, please try again later'),
  })

  // OTP guesses are limited per email address, so spreading attempts over many IPs does not help.
  const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.OTP_ATTEMPT_LIMIT || 5),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => {
      const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase().trim() : ''
      return email ? `otp:${email}` : `otp-ip:${ipKeyGenerator(req.ip)}`
    },
    handler: json('Too many OTP attempts. Request a new code in 15 minutes.'),
  })

  const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: Number(process.env.AI_RATE_LIMIT || 20),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: json('Too many AI requests, slow down a little'),
  })

  return { authLimiter, otpLimiter, aiLimiter }
}

module.exports = { createLimiters }
