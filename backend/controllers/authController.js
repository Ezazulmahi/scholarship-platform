const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/user')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

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

async function sendOtpEmail(to, otp, subject) {
  await transporter.sendMail({
    from: `"ScholarAid BD" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: `Your OTP code is: ${otp}\n\nThis code expires in 10 minutes.`,
  })
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
    await User.update(existing.id, { name: name.trim(), password_hash: passwordHash, otp, otp_expires_at: otpExpiresAt })
  } else {
    const { error } = await User.create({ name: name.trim(), email, password_hash: passwordHash, otp, otp_expires_at: otpExpiresAt })
    if (error) return res.status(500).json({ error: 'Registration failed' })
  }

  try {
    await sendOtpEmail(email, otp, 'Verify your Scholarship Platform account')
  } catch (err) {
    console.error('sendOtpEmail failed:', err.message)
    return res.status(500).json({ error: 'Failed to send verification email. Please try again later.' })
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
  if (!user.is_verified) return res.status(403).json({ error: 'Please verify your email first', needsVerification: true })

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
      await sendOtpEmail(email, otp, 'Reset your Scholarship Platform password')
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