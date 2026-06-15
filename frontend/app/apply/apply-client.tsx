'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

type Step = {
  n: number
  title: string
  desc: string
}

type CountryGuide = {
  country: string
  flag: string
  path: string
  timeline: string
  timelineNote: string
  steps: Step[]
  docs: string[]
  tip: string
  blocked_account: boolean
  blocked_amount?: string
}

type CountrySummary = {
  country: string
  flag: string
  timeline: string
}

export default function ApplyClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [countries, setCountries] = useState<CountrySummary[]>([])
  const [activeCountry, setActiveCountry] = useState<string>('Austria')
  const [guide, setGuide] = useState<CountryGuide | null>(null)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => router.replace('/'))
  }, [router])

  useEffect(() => {
    if (!user) return
    setLoadingCountries(true)
    api
      .get('/ai/apply/countries')
      .then(({ data }) => {
        setCountries(data.countries || [])
        if (data.countries?.length > 0) {
          fetchGuide(data.countries[0].country)
        }
      })
      .catch((err) => {
        console.error('Apply countries error:', err)
        setError('Could not load countries. Please try again.')
      })
      .finally(() => setLoadingCountries(false))
  }, [user])

  function fetchGuide(country: string) {
    setActiveCountry(country)
    setLoadingGuide(true)
    setError('')
    api
      .post('/ai/apply/guide', {
        country,
        profile: {
          name: user?.name,
          university: 'BRAC University',
          degree: 'BSc in Computer Science & Engineering',
          cgpa: '3.81',
          ielts: '7.5',
          field: 'Machine Learning, Distributed Systems',
        },
      })
      .then(({ data }) => setGuide(data))
      .catch((err) => {
        console.error('Apply guide error:', err)
        setError('Could not load guide. Please try again.')
      })
      .finally(() => setLoadingGuide(false))
  }

  if (!user) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="apply" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            · Step-by-Step
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            How to apply, by country.
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            Each destination has its own admission + visa path. Pick a country to
            see the exact sequence, documents, and timelines.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10 py-8">
        {/* Country tabs */}
        {loadingCountries ? (
          <div className="flex items-center gap-3 mb-8 text-emerald-900/50 text-sm">
            <span className="h-4 w-4 rounded-full border-2 border-emerald-300 border-t-emerald-700 animate-spin" />
            Loading countries…
          </div>
        ) : (
          <div className="flex gap-2 mb-8 flex-wrap">
            {countries.map((c) => (
              <button
                key={c.country}
                type="button"
                onClick={() => fetchGuide(c.country)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  activeCountry === c.country ? 'text-white' : 'text-emerald-950 hover:bg-white/60'
                }`}
                style={{
                  backgroundColor: activeCountry === c.country ? '#11382e' : '#f8f4ec',
                }}
              >
                {c.flag} {c.country}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {loadingGuide && (
          <div className="flex items-center justify-center py-20 text-emerald-900/50 text-sm">
            <span className="h-5 w-5 rounded-full border-2 border-emerald-300 border-t-emerald-700 animate-spin mr-3" />
            Loading guide…
          </div>
        )}

        {!loadingGuide && guide && (
          <div className="grid grid-cols-[1fr_340px] gap-6 items-start">
            {/* Steps card */}
            <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
                {guide.country.toUpperCase()} · {guide.path.toUpperCase()}
              </p>
              <h2 className="text-2xl font-bold text-emerald-950 mb-7">
                {guide.steps.length} steps · {guide.timeline} timeline
              </h2>

              <div className="space-y-0">
                {guide.steps.map((step, i) => (
                  <div
                    key={step.n}
                    className={`flex gap-4 ${i < guide.steps.length - 1 ? 'pb-6' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-0">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          backgroundColor: i === 0 ? '#11382e' : '#3ecb78',
                          color: i === 0 ? 'white' : '#0f2a1c',
                        }}
                      >
                        {step.n}
                      </div>
                      {i < guide.steps.length - 1 && (
                        <div
                          className="w-0.5 flex-1 mt-2"
                          style={{ backgroundColor: '#d1fae5', minHeight: '24px' }}
                        />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-bold text-emerald-950 mb-1">{step.title}</p>
                      <p className="text-sm text-emerald-900/60 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* Timeline */}
              <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#11382e' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-3">
                  Estimated timeline
                </p>
                <p className="text-4xl font-bold mb-2">{guide.timeline}</p>
                <p className="text-sm text-emerald-100/60">{guide.timelineNote}</p>
              </div>

              {/* Required documents */}
              <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-4">
                  Required Documents
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {guide.docs.map((doc) => (
                    <span
                      key={doc}
                      className="text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-900/15 text-emerald-900"
                      style={{ backgroundColor: '#e8f5e9' }}
                    >
                      {doc}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: '#11382e' }}
                >
                  Generate my checklist
                </button>
              </div>

              {/* Blocked account notice */}
              {guide.blocked_account && guide.blocked_amount && (
                <div className="rounded-2xl p-5 shadow-sm border border-amber-200" style={{ backgroundColor: '#fffbeb' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
                    Blocked Account Required
                  </p>
                  <p className="text-sm text-amber-900/70 leading-relaxed">
                    You must show a blocked bank account with {guide.blocked_amount} to obtain your visa.
                  </p>
                </div>
              )}

              {/* Key tip */}
              <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2">
                  Key Tip
                </p>
                <p className="text-sm text-emerald-900/70 leading-relaxed">{guide.tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}