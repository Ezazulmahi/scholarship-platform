const axios = require('axios')
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

async function proxyToAI(endpoint, body, res) {
  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}${endpoint}`, body, {
      timeout: 60000,
    })
    res.json(data)
  } catch (err) {
    const status = err.response?.status || 500
    const message = err.response?.data?.detail || err.message || 'AI service error'
    res.status(status).json({ error: message })
  }
}

async function proxyGetToAI(endpoint, res) {
  try {
    const { data } = await axios.get(`${AI_SERVICE_URL}${endpoint}`, { timeout: 15000 })
    res.json(data)
  } catch (err) {
    const status = err.response?.status || 500
    const message = err.response?.data?.detail || err.message || 'AI service error'
    res.status(status).json({ error: message })
  }
}

// ── Existing ──────────────────────────────────────────────────────────────────
async function generateSop(req, res) {
  await proxyToAI('/sop/generate', req.body, res)
}
async function matchScholarships(req, res) {
  await proxyToAI('/scholarships/match', req.body, res)
}
async function advisorChat(req, res) {
  await proxyToAI('/advisor/chat', req.body, res)
}
async function dashboardInsights(req, res) {
  await proxyToAI('/dashboard/insights', req.body, res)
}
async function applyCountries(req, res) {
  await proxyGetToAI('/apply/countries', res)
}
async function applyGuide(req, res) {
  await proxyToAI('/apply/guide', req.body, res)
}

// ── Costing (new 4-step flow) ─────────────────────────────────────────────────
async function costingCountries(req, res) {
  await proxyGetToAI('/costing/countries', res)
}
async function costingSummary(req, res) {
  await proxyGetToAI('/costing/summary', res)
}
async function costingUniversities(req, res) {
  await proxyToAI('/costing/universities', req.body, res)
}
async function costingSubjects(req, res) {
  await proxyToAI('/costing/subjects', req.body, res)
}
async function costingEstimate(req, res) {
  await proxyToAI('/costing/estimate', req.body, res)
}

module.exports = {
  generateSop,
  matchScholarships,
  costingCountries,
  costingSummary,
  costingUniversities,
  costingSubjects,
  costingEstimate,
  advisorChat,
  dashboardInsights,
  applyCountries,
  applyGuide,
}