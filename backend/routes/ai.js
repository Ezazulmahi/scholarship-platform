const express = require('express')
const {
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
} = require('../controllers/aiController')

const router = express.Router()

// ── Existing ──────────────────────────────────────────────────────────────────
router.post('/sop/generate',          generateSop)
router.post('/scholarships/match',    matchScholarships)
router.post('/advisor/chat',          advisorChat)
router.post('/dashboard/insights',    dashboardInsights)
router.get('/apply/countries',        applyCountries)
router.post('/apply/guide',           applyGuide)

// ── Costing (new 4-step flow) ─────────────────────────────────────────────────
router.get('/costing/countries',      costingCountries)
router.get('/costing/summary',        costingSummary)
router.post('/costing/universities',  costingUniversities)
router.post('/costing/subjects',      costingSubjects)
router.post('/costing/estimate',      costingEstimate)

module.exports = router