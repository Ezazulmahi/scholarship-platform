'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

type Profile = {
  university: string
  degree: string
  cgpa: string
  graduationYear: string
  ielts: string
  gre: string
  targetDegree: string
  preferredCountries: string
  fieldOfInterest: string
  budgetRange: string
  shortBio: string
}

const defaultProfile: Profile = {
  university: '',
  degree: '',
  cgpa: '',
  graduationYear: '',
  ielts: '',
  gre: '',
  targetDegree: "Master's (MSc)",
  preferredCountries: '',
  fieldOfInterest: '',
  budgetRange: 'Fully funded only',
  shortBio: '',
}

function CircleProgress({ pct }: { pct: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#d1fae5" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#3ecb78"
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-emerald-950">
        {pct}%
      </span>
    </div>
  )
}

export default function ProfileClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user)
        return api.get('/profile')
      })
      .then(({ data }) => {
        if (data.profile) setProfile((prev) => ({ ...prev, ...data.profile }))
      })
      .catch(() => router.replace('/'))
  }, [router])

  if (!user) return null

  function set(key: keyof Profile, val: string) {
    setProfile((p) => ({ ...p, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.post('/profile', profile)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      // ignore for now
    } finally {
      setSaving(false)
    }
  }

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const inputCls =
    'w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none focus:border-emerald-500 transition-colors'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="profile" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            · Profile Suite
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Your academic profile.
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            Everything we use to match scholarships and auto-fill applications
            lives here. Edit any field and the match engine recalculates
            instantly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-8 space-y-6">
        {/* Profile card */}
        <div className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
          {/* Header */}
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-emerald-900/10">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
              style={{ backgroundColor: '#c5a55a', color: '#17352e' }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-emerald-950">{user.name}</h2>
              <p className="text-sm text-emerald-900/60 mt-0.5">
                Computer Science · Bangladesh 🇧🇩
              </p>
            </div>
            <CircleProgress pct={92} />
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            {/* Academic */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Academic
              </p>
              <label className="block space-y-1.5">
                <span className="text-xs text-emerald-900/60 font-medium">University</span>
                <input className={inputCls} value={profile.university} onChange={(e) => set('university', e.target.value)} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-emerald-900/60 font-medium">Degree / Major</span>
                <input className={inputCls} value={profile.degree} onChange={(e) => set('degree', e.target.value)} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-xs text-emerald-900/60 font-medium">CGPA</span>
                  <input className={inputCls} value={profile.cgpa} onChange={(e) => set('cgpa', e.target.value)} />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-emerald-900/60 font-medium">Graduation year</span>
                  <input className={inputCls} value={profile.graduationYear} onChange={(e) => set('graduationYear', e.target.value)} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-xs text-emerald-900/60 font-medium">IELTS / Language</span>
                  <input className={inputCls} value={profile.ielts} onChange={(e) => set('ielts', e.target.value)} />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs text-emerald-900/60 font-medium">GRE</span>
                  <input className={inputCls} placeholder="Not added" value={profile.gre} onChange={(e) => set('gre', e.target.value)} />
                </label>
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Goals &amp; Preferences
              </p>
              <label className="block space-y-1.5">
                <span className="text-xs text-emerald-900/60 font-medium">Target degree</span>
                <select className={inputCls} value={profile.targetDegree} onChange={(e) => set('targetDegree', e.target.value)}>
                  <option>Bachelor&apos;s (BSc)</option>
                  <option>Master&apos;s (MSc)</option>
                  <option>PhD</option>
                  <option>MBA</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-emerald-900/60 font-medium">Preferred countries</span>
                <input className={inputCls} value={profile.preferredCountries} onChange={(e) => set('preferredCountries', e.target.value)} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-emerald-900/60 font-medium">Field of interest</span>
                <input className={inputCls} value={profile.fieldOfInterest} onChange={(e) => set('fieldOfInterest', e.target.value)} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-emerald-900/60 font-medium">Budget range (yearly)</span>
                <select className={inputCls} value={profile.budgetRange} onChange={(e) => set('budgetRange', e.target.value)}>
                  <option>Fully funded only</option>
                  <option>Up to €10,000/yr</option>
                  <option>Up to €20,000/yr</option>
                  <option>No limit</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-emerald-900/60 font-medium">Short bio</span>
                <textarea
                  rows={3}
                  className={inputCls + ' resize-none'}
                  value={profile.shortBio}
                  onChange={(e) => set('shortBio', e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-emerald-900/10">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: '#11382e' }}
            >
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
            <button
              type="button"
              className="px-6 py-2.5 rounded-full text-sm font-semibold border border-emerald-900/20 text-emerald-950 hover:bg-emerald-50 transition-colors"
            >
              Recalculate matches
            </button>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
              Documents
            </p>
            <p className="text-2xl font-bold text-emerald-950">5 of 7 uploaded</p>
            <p className="text-sm text-emerald-900/60 mt-2">
              Transcript ✓ · CV ✓ · IELTS ✓ · Passport ✓ · SOP draft ✓ · 2 LORs pending
            </p>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
              Eligibility
            </p>
            <p className="text-2xl font-bold text-emerald-950">Strong</p>
            <p className="text-sm text-emerald-900/60 mt-2">
              Your CGPA + IELTS clears 84% of saved scholarships&apos; minimum bars.
            </p>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
              Completeness
            </p>
            <p className="text-2xl font-bold text-emerald-950">Add GRE to unlock +12 matches</p>
            <p className="text-sm text-emerald-900/60 mt-2">
              Some US programmes filter on it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
