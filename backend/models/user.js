const supabase = require('../config/supabase')

async function findByEmail(email) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  return data
}

async function findById(id) {
  const { data } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('id', id)
    .maybeSingle()
  return data
}

async function create({ name, email, password_hash, otp, otp_expires_at }) {
  const { error } = await supabase.from('users').insert({
    name,
    email: email.toLowerCase().trim(),
    password_hash,
    otp,
    otp_expires_at,
  })
  return { error }
}

async function update(id, fields) {
  const { error } = await supabase.from('users').update(fields).eq('id', id)
  return { error }
}

module.exports = { findByEmail, findById, create, update }
