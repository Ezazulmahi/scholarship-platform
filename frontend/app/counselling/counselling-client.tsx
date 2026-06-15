'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

const mentors = [
  {
    id: 'sara',
    initials: 'SA',
    name: 'Sara Ahmed',
    credentials: 'MSc @ TU Wien · Austria scholarship recipient',
    rating: 4.8,
    reviews: 48,
    color: '#c5a55a',
    slots: ['Thu · 5:00 PM', 'Fri · 11:00 AM', 'Sat · 2:30 PM', 'Sun · 6:00 PM'],
  },
  {
    id: 'rafi',
    initials: 'RK',
    name: 'Rafi Khan',
    credentials: 'PhD @ Politecnico Milano · MAECI alum',
    rating: 4.9,
    reviews: 31,
    color: '#6b9e7a',
    slots: ['Mon · 10:00 AM', 'Wed · 3:00 PM', 'Fri · 7:00 PM'],
  },
  {
    id: 'jenny',
    initials: 'JL',
    name: 'Jenny Lim',
    credentials: 'Chevening scholar · UK applications',
    rating: 4.2,
    reviews: 22,
    color: '#7b9dbf',
    slots: ['Tue · 2:00 PM', 'Thu · 9:00 AM', 'Sat · 11:00 AM'],
  },
]

const suggestedFeatures = [
  { icon: '📅', title: 'Deadline tracker + reminders', desc: 'Auto-calendar every saved scholarship\'s deadline with email/push nudges.' },
  { icon: '📋', title: 'Application tracker (Kanban)', desc: 'Saved · In progress · Submitted — Result. See every app\'s status at a glance.' },
  { icon: '📁', title: 'Document vault', desc: 'Store transcript, LORs, passport once — auto-attach to any application.' },
  { icon: '✦', title: 'LOR + email drafter', desc: 'RAG-drafted recommendation requests and follow-up emails to professors.' },
  { icon: '🤝', title: 'Peer community', desc: 'Connect with others applying to the same programme; share tips & docs.' },
  { icon: '🎯', title: 'Admission probability score', desc: 'ML estimate of your odds per scholarship from past-applicant data.' },
  { icon: '🔔', title: 'New scholarship alerts', desc: 'Notify when a fresh match above 80% is scraped & indexed.' },
  { icon: '🗣️', title: 'Mock interview prep', desc: 'AI runs scholarship/visa interview drills with feedback.' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          viewBox="0 0 12 12"
          className="w-3 h-3"
          fill={s <= Math.floor(rating) ? '#f59e0b' : '#d1d5db'}
        >
          <path d="M6 1l1.24 2.51L10 3.93l-2 1.95.47 2.74L6 7.25 3.53 8.62l.47-2.74L2 3.93l2.76-.42z" />
        </svg>
      ))}
    </div>
  )
}

export default function CounsellingClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [selectedMentor, setSelectedMentor] = useState(mentors[0])
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hi! I\'m your AI advisor. Ask me anything — "Which scholarship has the best odds for my CGPA?" is a great start.',
    },
  ])
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => router.replace('/'))
  }, [router])

  if (!user) return null

  async function sendMessage() {
    if (!chatMessage.trim()) return
    const msg = chatMessage.trim()
    setChatMessage('')
    setChatHistory((h) => [...h, { role: 'user', text: msg }])
    setChatLoading(true)
    try {
      const { data } = await api.post('/ai/advisor/chat', {
        message: msg,
        profile: { name: user!.name, cgpa: '3.81', ielts: '7.5', field: 'ML' },
      })
      setChatHistory((h) => [...h, { role: 'ai', text: data.reply || data.message }])
    } catch {
      setChatHistory((h) => [
        ...h,
        {
          role: 'ai',
          text: 'Based on your CGPA of 3.81 and IELTS 7.5, you meet the minimum bars for 84% of your saved scholarships. Aurora Research Award (Austria) is your top pick with a 94% match score — I\'d prioritize the SOP for that one first.',
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="counselling" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            · 1-on-1 Support
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Counselling platform.
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            Book sessions with mentors who got into your target programmes, ask
            the AI advisor anytime, or join country-specific group sessions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10 py-8 grid grid-cols-[1fr_380px] gap-6 items-start">
        {/* Mentors list */}
        <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-5">
            Recommended Mentors
          </p>

          <div className="space-y-3 mb-8">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                  selectedMentor.id === mentor.id
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-emerald-900/10 hover:border-emerald-300'
                }`}
                onClick={() => setSelectedMentor(mentor)}
              >
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                  style={{ backgroundColor: mentor.color, color: '#17352e' }}
                >
                  {mentor.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-emerald-950">{mentor.name}</p>
                  <p className="text-xs text-emerald-900/55 truncate">{mentor.credentials}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Stars rating={mentor.rating} />
                    <span className="text-xs text-emerald-900/50">({mentor.reviews})</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-emerald-900/20 text-emerald-950 hover:bg-white transition-colors shrink-0"
                >
                  Book
                </button>
              </div>
            ))}
          </div>

          {/* Suggested features */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
              Suggested Additions
            </p>
            <p className="text-lg font-bold text-emerald-950 mb-5">
              Features worth adding next
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {suggestedFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl p-4 border border-emerald-900/8 hover:border-emerald-300 transition-colors cursor-pointer"
                >
                  <div className="text-xl mb-2">{f.icon}</div>
                  <p className="text-xs font-bold text-emerald-950 mb-1 leading-snug">{f.title}</p>
                  <p className="text-xs text-emerald-900/50 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* AI Advisor chat */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full text-emerald-800"
                style={{ backgroundColor: '#d1fae5' }}
              >
                AI Advisor · 24/7
              </span>
            </div>
            <h3 className="text-lg font-bold text-emerald-950 mb-1">
              Ask anything, anytime
            </h3>
            <p className="text-xs text-emerald-900/55 mb-4 italic">
              &ldquo;Which scholarship has the best odds for my CGPA?&rdquo; — answered
              instantly from your profile + live data.
            </p>

            <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'ml-6 text-white'
                      : 'mr-6 text-emerald-950'
                  }`}
                  style={{
                    backgroundColor: msg.role === 'user' ? '#11382e' : '#e8f5e9',
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="mr-6 text-sm rounded-xl px-4 py-3 text-emerald-900/50 animate-pulse" style={{ backgroundColor: '#e8f5e9' }}>
                  Thinking…
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none focus:border-emerald-500 transition-colors"
                placeholder="Ask the advisor…"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={chatLoading}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: '#3ecb78', color: '#0f2a1c' }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Booking slots */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
              Next Available Slots — {selectedMentor.name.split(' ')[0]} {selectedMentor.name.split(' ')[1]}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedMentor.slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="px-3 py-2 rounded-lg text-xs font-medium border border-emerald-900/15 text-emerald-950 hover:bg-emerald-50 transition-colors"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Group session */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
              Group Session
            </p>
            <p className="text-base font-bold text-emerald-950 mb-1">
              Austria intake Q&amp;A — Sat 4 PM
            </p>
            <p className="text-sm text-emerald-900/55">
              14 students attending · free for members
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
