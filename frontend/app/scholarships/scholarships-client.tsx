'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

type Scholarship = {
  id: string
  name: string
  country: string
  flag: string
  level: string
  funding: string
  deadline: string
  match: number
  type: 'Fully funded' | 'Partial' | 'Competitive'
}

const scholarships: Scholarship[] = [
  {
    id: 'aurora',
    name: 'Aurora Research Award',
    country: 'Austria',
    flag: '🇦🇹',
    level: 'MSc',
    funding: 'Full tuition + €1,100/mo',
    deadline: '4 days',
    match: 94,
    type: 'Fully funded',
  },
  {
    id: 'maeci',
    name: 'Italian Govt MAECI',
    country: 'Italy',
    flag: '🇮🇹',
    level: 'MSc/PhD',
    funding: '€9,000/yr + tuition waiver',
    deadline: '3 weeks',
    match: 89,
    type: 'Fully funded',
  },
  {
    id: 'chevening',
    name: 'Chevening (UK)',
    country: 'UK',
    flag: '🇬🇧',
    level: "Master's",
    funding: 'Full tuition + stipend',
    deadline: '2 months',
    match: 82,
    type: 'Partial',
  },
  {
    id: 'fulbright',
    name: 'Fulbright Foreign Student',
    country: 'USA',
    flag: '🇺🇸',
    level: "Master's/PhD",
    funding: 'Full funding',
    deadline: 'Opens Aug',
    match: 76,
    type: 'Competitive',
  },
  {
    id: 'daad',
    name: 'DAAD EPOS',
    country: 'Germany',
    flag: '🇩🇪',
    level: 'MSc',
    funding: '€934/mo + tuition',
    deadline: '5 weeks',
    match: 71,
    type: 'Fully funded',
  },
]

const filters = ['All', 'Fully funded', 'Austria', 'Italy', 'UK', 'USA', 'Deadline soon']

const typeColors: Record<string, { bg: string; text: string }> = {
  'Fully funded': { bg: '#fef3c7', text: '#92400e' },
  Partial: { bg: '#f0fdf4', text: '#15803d' },
  Competitive: { bg: '#f0f9ff', text: '#0369a1' },
}

export default function ScholarshipsClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => router.replace('/'))
  }, [router])

  if (!user) return null

  const filtered = scholarships.filter((s) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Fully funded') return s.type === 'Fully funded'
    if (activeFilter === 'Deadline soon') return parseInt(s.deadline) <= 7 || s.deadline.includes('days')
    return s.country === activeFilter
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="scholarships" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            · Live Matches
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Scholarships for you, right now.
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            Ranked by match score against your profile. Filter by country,
            funding type, and deadline. New matches appear as your profile grows.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10 py-8">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f
                  ? 'text-white'
                  : 'border border-emerald-900/20 text-emerald-950 hover:bg-white/50'
              }`}
              style={activeFilter === f ? { backgroundColor: '#11382e' } : { backgroundColor: '#f8f4ec' }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Scholarship grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((s) => {
            const badge = typeColors[s.type]
            return (
              <div
                key={s.id}
                className="rounded-2xl p-5 shadow-sm flex flex-col"
                style={{ backgroundColor: '#f8f4ec' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {s.type}
                  </span>
                  <span className="text-sm font-bold text-emerald-700">{s.match}%</span>
                </div>

                <div className="h-1.5 rounded-full mb-4" style={{ backgroundColor: '#d1fae5' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${s.match}%`, backgroundColor: '#3ecb78' }}
                  />
                </div>

                <h3 className="text-base font-bold text-emerald-950 mb-3 flex-1">{s.name}</h3>

                <div className="space-y-1.5 mb-4">
                  <p className="text-xs text-emerald-900/60">
                    {s.flag} {s.country} &nbsp;·&nbsp; 🎓 {s.level}
                  </p>
                  <p className="text-xs text-emerald-900/60">
                    💰 {s.funding} &nbsp;·&nbsp; ⏳ {s.deadline}
                  </p>
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    s.match >= 90
                      ? 'text-emerald-950'
                      : 'border border-emerald-900/20 text-emerald-950 hover:bg-white/60'
                  }`}
                  style={s.match >= 90 ? { backgroundColor: '#3ecb78' } : { backgroundColor: 'transparent' }}
                >
                  View &amp; apply
                </button>
              </div>
            )
          })}

          {/* Unlock card */}
          <div
            className="rounded-2xl p-5 flex flex-col items-center justify-center text-center text-white min-h-[200px]"
            style={{ backgroundColor: '#11382e' }}
          >
            <span className="text-3xl mb-3">+</span>
            <p className="text-lg font-bold mb-1">13 more matches</p>
            <p className="text-sm text-emerald-100/70">
              Complete GRE to unlock 12 US programmes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
