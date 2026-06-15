'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

const countries = [
  {
    name: 'Austria',
    key: 'austria',
    total: 9200,
    label: '€9.2k',
    breakdown: [
      { label: 'Tuition (public)', amount: '€1,500' },
      { label: 'Living + rent (12 mo)', amount: '€11,400' },
      { label: 'Health insurance', amount: '€700' },
      { label: 'Visa + residence permit', amount: '€220' },
      { label: '– Aurora scholarship', amount: '–€4,620', isDiscount: true },
    ],
    net: '€9,200',
    note: 'Net cost after a typical funded scholarship is applied.',
  },
  {
    name: 'Italy',
    key: 'italy',
    total: 7800,
    label: '€7.8k',
    breakdown: [
      { label: 'Tuition (public)', amount: '€2,000' },
      { label: 'Living + rent (12 mo)', amount: '€9,600' },
      { label: 'Health insurance', amount: '€400' },
      { label: 'Visa', amount: '€150' },
      { label: '– MAECI scholarship', amount: '–€4,350', isDiscount: true },
    ],
    net: '€7,800',
    note: 'EU public universities stay low; stipend covers most costs.',
  },
  {
    name: 'Germany',
    key: 'germany',
    total: 7100,
    label: '€7.1k',
    breakdown: [
      { label: 'Semester fee', amount: '€600' },
      { label: 'Living + rent (12 mo)', amount: '€10,800' },
      { label: 'Health insurance', amount: '€1,100' },
      { label: 'Visa', amount: '€100' },
      { label: '– DAAD EPOS', amount: '–€5,500', isDiscount: true },
    ],
    net: '€7,100',
    note: 'Germany has no tuition. Blocked account ~€11,208 required for visa.',
  },
  {
    name: 'UK',
    key: 'uk',
    total: 19000,
    label: '€19k',
    breakdown: [
      { label: 'Tuition (international)', amount: '€22,000' },
      { label: 'Living + rent (12 mo)', amount: '€14,400' },
      { label: 'Health surcharge (IHS)', amount: '€776' },
      { label: 'Visa', amount: '€490' },
      { label: '– Chevening award', amount: '–€18,666', isDiscount: true },
    ],
    net: '€19,000',
    note: 'UK depends heavily on scholarship coverage. Chevening is fully funded.',
  },
  {
    name: 'USA',
    key: 'usa',
    total: 23000,
    label: '€23k',
    breakdown: [
      { label: 'Tuition', amount: '€28,000' },
      { label: 'Living + rent (12 mo)', amount: '€16,800' },
      { label: 'Health insurance', amount: '€2,400' },
      { label: 'Visa (F-1)', amount: '€200' },
      { label: '– Fulbright award', amount: '–€24,400', isDiscount: true },
    ],
    net: '€23,000',
    note: 'USA depends heavily on aid. Fulbright covers tuition + stipend.',
  },
]

const maxCost = Math.max(...countries.map((c) => c.total))

export default function CostingClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [selected, setSelected] = useState(countries[0])

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => router.replace('/'))
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="costing" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            · Planner
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Costing breakdown.
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            A clear yearly estimate per destination — tuition, living, insurance,
            visa, and one-time costs — netted against the scholarship you&apos;re
            targeting.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10 py-8 grid grid-cols-[1fr_380px] gap-6 items-start">
        {/* Bar chart card */}
        <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-6">
            Yearly Total by Country (EUR)
          </p>

          {/* Bars */}
          <div className="flex items-end gap-6 h-52 px-4">
            {countries.map((c) => {
              const heightPct = (c.total / maxCost) * 100
              const isActive = c.key === selected.key
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setSelected(c)}
                  className="flex flex-col items-center gap-2 flex-1 group"
                >
                  <span className="text-xs font-semibold text-emerald-900/70">
                    {c.label}
                  </span>
                  <div className="w-full relative" style={{ height: `${heightPct}%` }}>
                    <div
                      className="absolute inset-0 rounded-t-lg transition-all"
                      style={{
                        background: isActive
                          ? 'linear-gradient(to top, #11382e, #3ecb78)'
                          : 'linear-gradient(to top, #1a4d38, #4ade80aa)',
                        opacity: isActive ? 1 : 0.6,
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${isActive ? 'text-emerald-900' : 'text-emerald-900/50'}`}
                  >
                    {c.name}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mt-6 text-xs text-emerald-900/50 border-t border-emerald-900/10 pt-4">
            {selected.note} EU public universities stay low; UK/USA depend heavily on aid.
          </p>

          {/* Bottom feature cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: '💡', title: 'Proof-of-funds calculator', desc: 'Tells you the exact bank balance to show for each country\'s visa.' },
              { icon: '📈', title: 'Living cost by city', desc: 'Vienna vs Milan vs London — rent, transport, food indexed.' },
              { icon: '🌐', title: 'Currency + inflation', desc: 'Estimates adjusted to live exchange rates.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl p-4 border border-emerald-900/10">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-sm font-semibold text-emerald-950 mb-1">{f.title}</p>
                <p className="text-xs text-emerald-900/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown panel */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-4">
            {selected.name.toUpperCase()} — Detailed Breakdown
          </p>
          <div className="mb-5">
            <span className="text-4xl font-bold text-emerald-950">{selected.net}</span>
            <span className="text-base text-emerald-900/55 ml-2">/ year est.</span>
          </div>

          <div className="space-y-3 mb-5">
            {selected.breakdown.map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between py-3 border-b border-emerald-900/8 ${
                  row.isDiscount ? 'text-emerald-700' : 'text-emerald-950'
                }`}
              >
                <span className={`text-sm ${row.isDiscount ? 'font-semibold' : ''}`}>
                  {row.label}
                </span>
                <span className={`text-sm font-semibold ${row.isDiscount ? 'text-emerald-600' : ''}`}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between py-3 border-t-2 border-emerald-900/20">
            <span className="text-sm font-bold text-emerald-950">Net you pay</span>
            <span className="text-sm font-bold text-emerald-950">{selected.net}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = countries[(countries.findIndex((c) => c.key === selected.key) + 1) % countries.length]
              setSelected(next)
            }}
            className="w-full mt-5 py-3 rounded-xl text-sm font-medium border border-emerald-900/20 text-emerald-950 hover:bg-emerald-50 transition-colors"
          >
            Compare another country
          </button>
        </div>
      </div>
    </div>
  )
}
