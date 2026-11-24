process.env.SUPABASE_URL = 'http://127.0.0.1:54321'
process.env.SUPABASE_KEY = 'test-key'
process.env.JWT_SECRET = 'test-secret-for-unit-tests-only'
process.env.OTP_ATTEMPT_LIMIT = '3'

const { test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const { createApp } = require('../app')

let users

beforeEach(() => {
  users = new Map()
  User.findByEmail = async (email) => [...users.values()].find((u) => u.email === email.toLowerCase().trim()) || null
  User.findById = async (id) => {
    const u = users.get(id)
    return u ? { id: u.id, name: u.name, email: u.email } : null
  }
  User.update = async (id, fields) => {
    Object.assign(users.get(id), fields)
    return { error: null }
  }
  User.create = async () => ({ error: null })
})

async function addUser(overrides = {}) {
  const id = overrides.id || `u${users.size + 1}`
  const user = {
    id,
    name: 'Nadia',
    email: 'nadia@example.com',
    password_hash: await bcrypt.hash('correct-horse', 4),
    is_verified: true,
    otp: null,
    otp_expires_at: null,
    ...overrides,
  }
  users.set(id, user)
  return user
}

test('health check answers', async () => {
  const res = await request(createApp()).get('/health')
  assert.equal(res.status, 200)
  assert.equal(res.body.status, 'ok')
})

test('the debug /test route that leaked user rows is gone', async () => {
  const res = await request(createApp()).get('/test')
  assert.equal(res.status, 404)
})

test('register validates email and password length before touching the database', async () => {
  const app = createApp()
  const badEmail = await request(app).post('/auth/register').send({ name: 'A', email: 'not-an-email', password: 'longenough' })
  assert.equal(badEmail.status, 400)
  const shortPw = await request(app).post('/auth/register').send({ name: 'A', email: 'a@example.com', password: 'short' })
  assert.equal(shortPw.status, 400)
  const notString = await request(app).post('/auth/register').send({ name: 'A', email: { $ne: 1 }, password: 'longenough' })
  assert.equal(notString.status, 400)
})

test('login sets an httpOnly cookie and /auth/me returns the user without secrets', async () => {
  await addUser()
  const app = createApp()
  const login = await request(app).post('/auth/login').send({ email: 'Nadia@Example.com', password: 'correct-horse' })
  assert.equal(login.status, 200)
  const cookie = login.headers['set-cookie'][0]
  assert.match(cookie, /HttpOnly/)
  assert.match(cookie, /Secure/)

  const me = await request(app).get('/auth/me').set('Cookie', cookie)
  assert.equal(me.status, 200)
  assert.equal(me.body.user.email, 'nadia@example.com')
  assert.equal(me.body.user.password_hash, undefined)
})

test('wrong password and unknown email get the same 401', async () => {
  await addUser()
  const app = createApp()
  const wrong = await request(app).post('/auth/login').send({ email: 'nadia@example.com', password: 'nope-nope' })
  const unknown = await request(app).post('/auth/login').send({ email: 'ghost@example.com', password: 'nope-nope' })
  assert.equal(wrong.status, 401)
  assert.equal(unknown.status, 401)
  assert.equal(wrong.body.error, unknown.body.error)
})

test('unverified users cannot log in', async () => {
  await addUser({ is_verified: false })
  const res = await request(createApp()).post('/auth/login').send({ email: 'nadia@example.com', password: 'correct-horse' })
  assert.equal(res.status, 403)
  assert.equal(res.body.needsVerification, true)
})

test('verify-otp accepts the right code once and rejects expired codes', async () => {
  const future = new Date(Date.now() + 60_000).toISOString()
  await addUser({ is_verified: false, otp: '123456', otp_expires_at: future })
  const app = createApp()

  const wrong = await request(app).post('/auth/verify-otp').send({ email: 'nadia@example.com', otp: '000000' })
  assert.equal(wrong.status, 400)

  const ok = await request(app).post('/auth/verify-otp').send({ email: 'nadia@example.com', otp: '123456' })
  assert.equal(ok.status, 200)
  assert.equal(users.get('u1').is_verified, true)
  assert.equal(users.get('u1').otp, null)

  await addUser({ id: 'u2', email: 'old@example.com', otp: '654321', otp_expires_at: new Date(Date.now() - 1000).toISOString() })
  const expired = await request(app).post('/auth/verify-otp').send({ email: 'old@example.com', otp: '654321' })
  assert.equal(expired.status, 400)
})

test('OTP guessing is rate limited per email', async () => {
  await addUser({ is_verified: false, otp: '111111', otp_expires_at: new Date(Date.now() + 60_000).toISOString() })
  const app = createApp()
  for (let i = 0; i < 3; i++) {
    const r = await request(app).post('/auth/verify-otp').send({ email: 'nadia@example.com', otp: `00000${i}` })
    assert.equal(r.status, 400)
  }
  const blocked = await request(app).post('/auth/verify-otp').send({ email: 'nadia@example.com', otp: '111111' })
  assert.equal(blocked.status, 429)
})

test('reset-password enforces the minimum length', async () => {
  await addUser({ otp: '222222', otp_expires_at: new Date(Date.now() + 60_000).toISOString() })
  const res = await request(createApp()).post('/auth/reset-password').send({ email: 'nadia@example.com', otp: '222222', newPassword: 'abc' })
  assert.equal(res.status, 400)
})

test('profile needs a session cookie', async () => {
  const res = await request(createApp()).get('/profile')
  assert.equal(res.status, 401)
})

test('CORS only echoes allowed origins', async () => {
  const app = createApp()
  const good = await request(app).get('/health').set('Origin', 'http://localhost:3000')
  assert.equal(good.headers['access-control-allow-origin'], 'http://localhost:3000')
  const evil = await request(app).get('/health').set('Origin', 'https://evil.example')
  assert.equal(evil.headers['access-control-allow-origin'], undefined)
})

test('malformed JSON gets a 400', async () => {
  const res = await request(createApp())
    .post('/auth/login')
    .set('Content-Type', 'application/json')
    .send('{"email":')
  assert.equal(res.status, 400)
})
