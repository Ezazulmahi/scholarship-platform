'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

type Country = { country: string; flag: string }

type University = {
  id: string
  name: string
  city: string
  rank_qs: number | null
  type: 'public' | 'private'
  tuition_range_eur: string
  notable_for: string
  website: string
}

type Programme = {
  id: string
  title: string
  degree: string
  duration_years: number
  language: string
  tuition_eur_per_year: number
  scholarship_available: boolean
  scholarship_name: string | null
  application_deadline: string
  programme_url: string | null
}

type BreakdownRow = { label: string; amount: number; isDiscount?: boolean }

type CostingResult = {
  country: string
  university: string
  programme: string
  gross_eur: number
  net_eur: number
  breakdown: BreakdownRow[]
  blocked_account_required: boolean
  blocked_account_amount?: number
  ai_tip: string
  university_url: string
  programme_url: string
}

type Step = 'country' | 'university' | 'subject' | 'costing'

const PROFILE = {
  university: 'BRAC University',
  degree: 'BSc in Computer Science & Engineering',
  cgpa: '3.81',
  ielts: '7.5',
  field: 'Machine Learning, Distributed Systems',
  budget_range: 'Fully funded only',
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="h-8 w-8 rounded-full border-2 border-emerald-200 border-t-emerald-700 animate-spin" />
      <p className="text-sm text-emerald-900/50">{label}</p>
    </div>
  )
}

// ── Step breadcrumb ───────────────────────────────────────────────────────────
function Breadcrumb({
  step,
  country,
  university,
  onCountry,
  onUniversity,
}: {
  step: Step
  country: string
  university: string
  onCountry: () => void
  onUniversity: () => void
}) {
  const crumbs = [
    { id: 'country',    label: country || 'Country',        active: step === 'country' },
    { id: 'university', label: university || 'University',  active: step === 'university' },
    { id: 'subject',    label: 'Programme',                 active: step === 'subject' },
    { id: 'costing',    label: 'Costing',                   active: step === 'costing' },
  ]

  const handlers: Record<string, (() => void) | null> = {
    country:    onCountry,
    university: country ? onUniversity : null,
    subject:    null,
    costing:    null,
  }

  return (
    <div className="flex items-center gap-1 mb-8 flex-wrap">
      {crumbs.map((c, i) => (
        <span key={c.id} className="flex items-center gap-1">
          {i > 0 && <span className="text-emerald-900/30 text-sm mx-1">›</span>}
          <button
            type="button"
            disabled={!handlers[c.id]}
            onClick={() => handlers[c.id]?.()}
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
              c.active
                ? 'text-white'
                : handlers[c.id]
                ? 'text-emerald-900/60 hover:text-emerald-900 hover:bg-white/50'
                : 'text-emerald-900/30 cursor-default'
            }`}
            style={c.active ? { backgroundColor: '#11382e' } : {}}
          >
            {c.label}
          </button>
        </span>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CostingClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  const [step, setStep] = useState<Step>('country')
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [selectedUni, setSelectedUni] = useState<University | null>(null)
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [selectedProg, setSelectedProg] = useState<Programme | null>(null)
  const [costing, setCosting] = useState<CostingResult | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => router.replace('/'))
  }, [router])

  useEffect(() => {
    if (!user) return
    api.get('/ai/costing/countries')
      .then(({ data }) => setCountries(data.countries || []))
      .catch(() => setError('Could not load countries.'))
  }, [user])

  // ── Step handlers ──────────────────────────────────────────────────────────

  function pickCountry(c: Country) {
    setSelectedCountry(c)
    setSelectedUni(null)
    setSelectedProg(null)
    setCosting(null)
    setUniversities([])
    setProgrammes([])
    setError('')
    setLoading(true)
    setStep('university')
    api.post('/ai/costing/universities', { country: c.country })
      .then(({ data }) => setUniversities(data.universities || []))
      .catch(() => setError('Could not load universities. Please try again.'))
      .finally(() => setLoading(false))
  }

  function pickUniversity(u: University) {
    setSelectedUni(u)
    setSelectedProg(null)
    setCosting(null)
    setProgrammes([])
    setError('')
    setLoading(true)
    setStep('subject')
    api.post('/ai/costing/subjects', {
      country: selectedCountry!.country,
      university_id: u.id,
      university_name: u.name,
    })
      .then(({ data }) => setProgrammes(data.programmes || []))
      .catch(() => setError('Could not load programmes. Please try again.'))
      .finally(() => setLoading(false))
  }

  function pickProgramme(p: Programme) {
    setSelectedProg(p)
    setCosting(null)
    setError('')
    setLoading(true)
    setStep('costing')
    api.post('/ai/costing/estimate', {
      country: selectedCountry!.country,
      university_name: selectedUni!.name,
      programme_title: p.title,
      tuition_eur_per_year: p.tuition_eur_per_year,
      university_website: selectedUni!.website || '',
      programme_url: p.programme_url || '',
      profile: PROFILE,
    })
      .then(({ data }) => setCosting(data))
      .catch(() => setError('Could not load costing. Please try again.'))
      .finally(() => setLoading(false))
  }

  function goToCountry() { setStep('country'); setError('') }
  function goToUniversity() { if (selectedCountry) { setStep('university'); setError('') } }

  if (!user) return null

  const heroLabels: Record<Step, { eyebrow: string; title: string; sub: string }> = {
    country:    { eyebrow: '· Step 1 of 4', title: 'Pick a destination.',      sub: 'Where do you want to study? Select a country to explore universities.' },
    university: { eyebrow: '· Step 2 of 4', title: `Universities in ${selectedCountry?.country || ''}.`, sub: 'Choose a university to see English-taught programmes.' },
    subject:    { eyebrow: '· Step 3 of 4', title: 'Choose a programme.',       sub: `English-taught Master's & PhD programmes at ${selectedUni?.name || ''}.` },
    costing:    { eyebrow: '· Step 4 of 4', title: 'Your cost estimate.',       sub: `Full yearly breakdown for ${selectedProg?.title || ''} at ${selectedUni?.name || ''}.` },
  }

  const hero = heroLabels[step]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="costing" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            {hero.eyebrow}
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            {hero.title}
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">{hero.sub}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-10 py-8">

        {/* Breadcrumb */}
        {step !== 'country' && (
          <Breadcrumb
            step={step}
            country={selectedCountry ? `${selectedCountry.flag} ${selectedCountry.country}` : ''}
            university={selectedUni?.name || ''}
            onCountry={goToCountry}
            onUniversity={goToUniversity}
          />
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* ── STEP 1: Country grid ─────────────────────────────────────────── */}
        {step === 'country' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {countries.map((c) => (
              <button
                key={c.country}
                type="button"
                onClick={() => pickCountry(c)}
                className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-md transition-all group"
                style={{ backgroundColor: '#f8f4ec' }}
              >
                <span className="text-4xl">{c.flag}</span>
                <span className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                  {c.country}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 2: Universities ─────────────────────────────────────────── */}
        {step === 'university' && (
          <>
            {loading ? (
              <Spinner label={`Finding universities in ${selectedCountry?.country}…`} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {universities.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => pickUniversity(u)}
                    className="rounded-2xl p-6 text-left hover:shadow-md transition-all group"
                    style={{ backgroundColor: '#f8f4ec' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-base font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors leading-snug">
                          {u.name}
                        </p>
                        <p className="text-xs text-emerald-900/55 mt-1">
                          {u.city} · {u.type === 'public' ? 'Public' : 'Private'}
                        </p>
                      </div>
                      {u.rank_qs && (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ml-3"
                          style={{ backgroundColor: '#d1fae5', color: '#064e3b' }}
                        >
                          QS #{u.rank_qs}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-900/60 leading-relaxed mb-3">
                      {u.notable_for}
                    </p>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: '#e8f5e9', color: '#166534' }}
                    >
                      {u.tuition_range_eur}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── STEP 3: Programmes ───────────────────────────────────────────── */}
        {step === 'subject' && (
          <>
            {loading ? (
              <Spinner label={`Loading English programmes at ${selectedUni?.name}…`} />
            ) : (
              <div className="space-y-3">
                {programmes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickProgramme(p)}
                    className="w-full rounded-2xl p-5 text-left hover:shadow-md transition-all group flex items-center gap-5"
                    style={{ backgroundColor: '#f8f4ec' }}
                  >
                    {/* Degree badge */}
                    <div
                      className="h-14 w-14 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: '#11382e', color: '#3ecb78' }}
                    >
                      {p.degree}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-emerald-900/55 mt-0.5">
                        {p.duration_years} yr · Deadline: {p.application_deadline}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-emerald-950">
                        €{p.tuition_eur_per_year.toLocaleString()}
                      </p>
                      <p className="text-xs text-emerald-900/50">/year</p>
                      {p.scholarship_available && (
                        <span
                          className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#d1fae5', color: '#064e3b' }}
                        >
                          Scholarship
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── STEP 4: Costing ──────────────────────────────────────────────── */}
        {step === 'costing' && (
          <>
            {loading ? (
              <Spinner label="Calculating your cost estimate…" />
            ) : costing ? (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-start">

                {/* Breakdown card */}
                <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
                    {costing.university}
                  </p>
                  <p className="text-2xl font-bold text-emerald-950 mb-1">{costing.programme}</p>
                  <p className="text-xs text-emerald-900/50 mb-7">{costing.country} · per year estimate</p>

                  <div className="space-y-0 mb-4">
                    {costing.breakdown.map((row, i) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between py-3.5 ${
                          i < costing.breakdown.length - 1 ? 'border-b border-emerald-900/8' : ''
                        } ${row.isDiscount ? 'text-emerald-700' : 'text-emerald-950'}`}
                      >
                        <span className={`text-sm ${row.isDiscount ? 'font-semibold' : ''}`}>
                          {row.label}
                        </span>
                        <span className={`text-sm font-semibold tabular-nums ${row.isDiscount ? 'text-emerald-600' : ''}`}>
                          {row.isDiscount ? '–' : ''}€{Math.abs(row.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-center justify-between py-4 rounded-xl px-4 mt-2"
                    style={{ backgroundColor: '#11382e' }}
                  >
                    <span className="text-sm font-bold text-white">Total per year</span>
                    <span className="text-xl font-bold text-emerald-300">
                      €{costing.gross_eur.toLocaleString()}
                    </span>
                  </div>

                  {costing.ai_tip && (
                    <div
                      className="mt-4 rounded-xl px-4 py-3 text-sm text-emerald-800 leading-relaxed"
                      style={{ backgroundColor: '#e8f5e9', borderLeft: '3px solid #3ecb78' }}
                    >
                      💡 {costing.ai_tip}
                    </div>
                  )}

                  {/* Links */}
                  <div className="mt-5 flex gap-3">
                    <a
                      href={costing.university_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-center border border-emerald-900/20 text-emerald-950 hover:bg-white/60 transition-colors"
                      style={{ backgroundColor: '#f8f4ec' }}
                    >
                      🏛 University Website ↗
                    </a>
                    <a
                      href={costing.programme_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-center text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#11382e' }}
                    >
                      📘 Programme Page ↗
                    </a>
                  </div>
                </div>

                {/* Right panel */}
                <div className="space-y-4">

                  {/* Total highlight */}
                  <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#11382e' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-3">
                      Yearly Total
                    </p>
                    <p className="text-5xl font-bold mb-1">€{(costing.gross_eur / 1000).toFixed(1)}k</p>
                    <p className="text-sm text-emerald-100/60">All-in estimate including living costs</p>
                  </div>

                  {/* Programme info */}
                  {selectedProg && (
                    <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
                      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                        Programme Info
                      </p>
                      <div className="space-y-2 text-sm text-emerald-900">
                        <div className="flex justify-between">
                          <span className="text-emerald-900/55">Degree</span>
                          <span className="font-semibold">{selectedProg.degree}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-900/55">Duration</span>
                          <span className="font-semibold">{selectedProg.duration_years} year{selectedProg.duration_years > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-900/55">Language</span>
                          <span className="font-semibold">{selectedProg.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-900/55">Deadline</span>
                          <span className="font-semibold">{selectedProg.application_deadline}</span>
                        </div>
                        {selectedProg.scholarship_available && (
                          <div className="flex justify-between">
                            <span className="text-emerald-900/55">Scholarship</span>
                            <span className="font-semibold text-emerald-700">{selectedProg.scholarship_name || 'Available'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Blocked account notice */}
                  {costing.blocked_account_required && costing.blocked_account_amount && (
                    <div
                      className="rounded-2xl p-5 border border-amber-200"
                      style={{ backgroundColor: '#fffbeb' }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
                        Blocked Account Required
                      </p>
                      <p className="text-sm text-amber-900/70 leading-relaxed">
                        Show a blocked bank account with{' '}
                        <strong>€{costing.blocked_account_amount.toLocaleString()}</strong> for your
                        visa application.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <button
                    type="button"
                    onClick={goToUniversity}
                    className="w-full py-3 rounded-xl text-sm font-semibold border border-emerald-900/20 text-emerald-950 hover:bg-white/60 transition-colors"
                    style={{ backgroundColor: '#f8f4ec' }}
                  >
                    ← Change university
                  </button>
                  <button
                    type="button"
                    onClick={goToCountry}
                    className="w-full py-3 rounded-xl text-sm font-medium text-emerald-900/50 hover:text-emerald-900 transition-colors"
                  >
                    Compare another country
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}