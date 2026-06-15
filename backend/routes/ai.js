const express = require('express')
const {
  generateSop,
  matchScholarships,
  costingEstimate,
  costingSummary,
  advisorChat,
  dashboardInsights,
} = require('../controllers/aiController')

const router = express.Router()

router.post('/sop/generate', generateSop)
router.post('/scholarships/match', matchScholarships)
router.post('/costing/estimate', costingEstimate)
router.get('/costing/summary', costingSummary)
router.post('/advisor/chat', advisorChat)
router.post('/dashboard/insights', dashboardInsights)

module.exports = router
