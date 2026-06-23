const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/user')

const COOKIE_NAME = 'scholarship_session'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function normalizeEmail(email) {
  return email.toLowerCase().trim()
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function getOtpEmailContent(otp) {
  return {
    text: `Your OTP code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1d4ed8; margin-bottom: 8px;">ScholarPath</h2>
        <p style="color: #374151;">Your one-time verification code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  }
}

function readMailConfig() {
  const user =
    process.env.EMAIL_USER ||
    process.env.SMTP_USER ||
    process.env.GMAIL_USER

  const pass =
    process.env.EMAIL_PASS ||
    process.env.SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD

  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)

  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : port === 465

  const missing = []
  if (!user) missing.push('EMAIL_USER')
  if (!pass) missing.push('EMAIL_PASS')
  if (!Number.isInteger(port) || port <= 0) missing.push('SMTP_PORT')

  if (missing.length > 0) {
    throw new Error(
      `Mail configuration missing/invalid: ${missing.join(', ')}. Configure these in the deployed backend environment.`
    )
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
    from: process.env.EMAIL_FROM || `"ScholarPath" <${user}>`,
  }
}

function createTransporter() {
  const mailConfig = readMailConfig()

  return nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: mailConfig.auth,
  })
}

async function sendEmailWithSmtp({ to, subject, text, html }) {
  const mailConfig = readMailConfig()
  const transporter = createTransporter()

  const info = await transporter.sendMail({
    from: mailConfig.from,
    to,
    subject,
    text,
    html,
  })

  return info.messageId
}

async function sendOtpEmail(to, otp, subject) {
  const recipient = normalizeEmail(to)
  const content = getOtpEmailContent(otp)

  const messageId = await sendEmailWithSmtp({
    to: recipient,
    subject,
    text: content.text,
    html: content.html,
  })

  console.log('OTP sent via SMTP:', recipient, messageId)
}

function mailStatus(req, res) {
  const smtpUser =
    process.env.EMAIL_USER ||
    process.env.SMTP_USER ||
    process.env.GMAIL_USER

  const smtpPass =
    process.env.EMAIL_PASS ||
    process.env.SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD

  res.json({
    provider: 'smtp',
    smtp: {
      configured: Boolean(smtpUser && smtpPass),
      userConfigured: Boolean(smtpUser),
      passwordConfigured: Boolean(smtpPass),
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
    },
  })
}

async function register(req, res) {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }

  const normalizedEmail = normalizeEmail(email)
  const existing = await User.findByEmail(normalizedEmail)

  if (existing?.is_verified) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const otp = generateOtp()
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  if (existing && !existing.is_verified) {
    const { error } = await User.update(existing.id, {
      name: name.trim(),
      password_hash: passwordHash,
      otp,
      otp_expires_at: otpExpiresAt,
    })
    if (error) {
      console.error('Registration update failed:', error.message)
      return res.status(500).json({ error: 'Registration failed' })
    }
  } else {
    const { error } = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      otp,
      otp_expires_at: otpExpiresAt,
    })
    if (error) {
      console.error('Registration create failed:', error.message)
      return res.status(500).json({ error: 'Registration failed' })
    }
  }

  try {
    await sendOtpEmail(normalizedEmail, otp, 'Verify your ScholarPath account')
  } catch (err) {
    console.error('sendOtpEmail failed:', err.message, err.code || '')
    return res.status(500).json({
      error: 'Failed to send verification email. Please try again later.',
    })
  }

  res.json({ message: 'OTP sent to your email' })
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' })

  const user = await User.findByEmail(normalizeEmail(email))
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })
  if (new Date(user.otp_expires_at) < new Date()) return res.status(400).json({ error: 'OTP has expired' })

  await User.update(user.id, { is_verified: true, otp: null, otp_expires_at: null })

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
  res.json({ user: { id: user.id, name: user.name, email: user.email } })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  const user = await User.findByEmail(normalizeEmail(email))
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })

  if (!user.is_verified) {
    return res.status(403).json({
      error: 'Please verify your email first',
      needsVerification: true,
    })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
  res.json({ user: { id: user.id, name: user.name, email: user.email } })
}

function logout(req, res) {
  res.clearCookie(COOKIE_NAME)
  res.json({ message: 'Logged out' })
}

async function me(req, res) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ error: 'User not found' })
    res.json({ user })
  } catch {
    res.clearCookie(COOKIE_NAME)
    res.status(401).json({ error: 'Invalid session' })
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  const normalizedEmail = normalizeEmail(email)
  const user = await User.findByEmail(normalizedEmail)

  if (user) {
    const otp = generateOtp()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await User.update(user.id, { otp, otp_expires_at: otpExpiresAt })

    try {
      await sendOtpEmail(normalizedEmail, otp, 'Reset your ScholarPath password')
    } catch (err) {
      console.error('sendOtpEmail failed:', err.message, err.code || '')
      return res.status(500).json({ error: 'Failed to send OTP. Please try again later.' })
    }
  }

  res.json({ message: 'If that email is registered, an OTP has been sent' })
}

async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const user = await User.findByEmail(normalizeEmail(email))

  if (!user || user.otp !== otp || new Date(user.otp_expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await User.update(user.id, {
    password_hash: passwordHash,
    otp: null,
    otp_expires_at: null,
  })

  res.json({ message: 'Password reset successful' })
}

module.exports = {
  register,
  verifyOtp,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  mailStatus,
}