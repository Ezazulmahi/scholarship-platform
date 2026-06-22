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

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function createTransporter() {
  // Validate required env vars early so errors are obvious in logs
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use a Gmail App Password, NOT your real password
    },
  })
}

async function sendOtpEmail(to, otp, subject) {
  const transporter = createTransporter()

  const info = await transporter.sendMail({
    from: `"ScholarPath" <${process.env.EMAIL_USER}>`,
    to,
    subject,
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
  })

  console.log('✅ OTP email sent to:', to, '| MessageId:', info.messageId)
}

async function register(req, res) {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }

  const existing = await User.findByEmail(email)
  if (existing?.is_verified) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const otp = generateOtp()
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  if (existing && !existing.is_verified) {
    await User.update(existing.id, {
      name: name.trim(),
      password_hash: passwordHash,
      otp,
      otp_expires_at: otpExpiresAt,
    })
  } else {
    const { error } = await User.create({
      name: name.trim(),
      email,
      password_hash: passwordHash,
      otp,
      otp_expires_at: otpExpiresAt,
    })
    if (error) return res.status(500).json({ error: 'Registration failed' })
  }

  try {
    await sendOtpEmail(email, otp, 'Verify your ScholarPath account')
  } catch (err) {
    console.error('sendOtpEmail failed:', err.message)
    return res.status(500).json({
      error: 'Failed to send verification email. Please try again later.',
    })
  }

  res.json({ message: 'OTP sent to your email' })
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' })

  const user = await User.findByEmail(email)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })
  if (new Date(user.otp_expires_at) < new Date()) return res.status(400).json({ error: 'OTP has expired' })

  await User.update(user.id, { is_verified: true, otp: null, otp_expires_at: null })

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
  res.json({ user: { id: user.id, name: user.name, email: user.email } })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  const user = await User.findByEmail(email)
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })
  if (!user.is_verified) {
    return res.status(403).json({ error: 'Please verify your email first', needsVerification: true })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
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

  const user = await User.findByEmail(email)
  if (user) {
    const otp = generateOtp()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    await User.update(user.id, { otp, otp_expires_at: otpExpiresAt })
    try {
      await sendOtpEmail(email, otp, 'Reset your ScholarPath password')
    } catch (err) {
      console.error('sendOtpEmail failed:', err.message)
      return res.status(500).json({ error: 'Failed to send OTP. Please try again later.' })
    }
  }

  res.json({ message: 'If that email is registered, an OTP has been sent' })
}

async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body
  if (!email || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required' })

  const user = await User.findByEmail(email)
  if (!user || user.otp !== otp || new Date(user.otp_expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await User.update(user.id, { password_hash: passwordHash, otp: null, otp_expires_at: null })

  res.json({ message: 'Password reset successful' })
}

module.exports = { register, verifyOtp, login, logout, me, forgotPassword, resetPassword }