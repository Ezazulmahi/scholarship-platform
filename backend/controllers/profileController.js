const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')

const COOKIE_NAME = 'scholarship_session'

function getUserIdFromCookie(req) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return null
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    return payload.id
  } catch {
    return null
  }
}

const DEFAULTS = {
  university: '',
  degree: '',
  cgpa: '',
  graduation_year: '',
  ielts: '',
  gre: '',
  target_degree: "Master's (MSc)",
  preferred_countries: '',
  field_of_interest: '',
  budget_range: 'Fully funded only',
  short_bio: '',
}

function toClientShape(row) {
  return {
    university: row.university || '',
    degree: row.degree || '',
    cgpa: row.cgpa || '',
    graduationYear: row.graduation_year || '',
    ielts: row.ielts || '',
    gre: row.gre || '',
    targetDegree: row.target_degree || "Master's (MSc)",
    preferredCountries: row.preferred_countries || '',
    fieldOfInterest: row.field_of_interest || '',
    budgetRange: row.budget_range || 'Fully funded only',
    shortBio: row.short_bio || '',
  }
}

async function getProfile(req, res) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) return res.status(500).json({ error: 'Failed to load profile' })

  res.json({ profile: data ? toClientShape(data) : toClientShape(DEFAULTS) })
}

async function saveProfile(req, res) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const {
    university, degree, cgpa, graduationYear, ielts, gre,
    targetDegree, preferredCountries, fieldOfInterest, budgetRange, shortBio,
  } = req.body

  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: userId,
      university: university || '',
      degree: degree || '',
      cgpa: cgpa || '',
      graduation_year: graduationYear || '',
      ielts: ielts || '',
      gre: gre || '',
      target_degree: targetDegree || "Master's (MSc)",
      preferred_countries: preferredCountries || '',
      field_of_interest: fieldOfInterest || '',
      budget_range: budgetRange || 'Fully funded only',
      short_bio: shortBio || '',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (error) return res.status(500).json({ error: 'Failed to save profile' })

  res.json({ success: true })
}

module.exports = { getProfile, saveProfile }
