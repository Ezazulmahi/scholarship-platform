'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

const checklist = [
  {
    id: 'sop',
    text: 'Finish your personal statement draft',
    sub: 'Aurora Research Award — due in 4 days',
    done: true,
  },
  {
    id: 'ielts',
    text: 'Upload IELTS / language certificate',
    sub: 'Required by 3 of your open applications',
    done: false,
  },
  {
    id: 'lor',
    text: 'Request 2nd recommendation letter',
    sub: 'Prof. mentor — give 2 weeks notice',
    done: false,
  },
  {
    id: 'shortlist',
    text: 'Submit two shortlists before deadline window',
    sub: 'Next milestone',
    done: false,
  },
]

export default function DashboardClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState(checklist)

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => router.replace('/'))
  }, [router])

  if (!user) return null

  const firstName = user.name.split(' ')[0]

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="dashboard" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 mb-8">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Signed in as {user.email}
            <span className="text-white/40 mx-1">·</span>
            <span className="text-white/60 text-xs tracking-widest font-medium uppercase">
              Your Workspace
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Welcome back,<br />
            {user.name}.
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            Your scholarship workspace is ready with active matches, upcoming
            deadlines, and the next actions to finish this week.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-10 -mt-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Profile strength', value: '92%' },
            { label: 'Open applications', value: '6' },
            { label: 'Upcoming deadlines', value: '3' },
            { label: 'Saved scholarships', value: '18' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: '#f8f4ec' }}
            >
              <p className="text-sm text-emerald-900/60">{s.label}</p>
              <p className="mt-2 text-4xl font-bold text-emerald-950">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10 py-8 grid grid-cols-[1fr_380px] gap-6">
        {/* Checklist card */}
        <div
          className="rounded-2xl p-7 shadow-sm"
          style={{ backgroundColor: '#f8f4ec' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
            This Week
          </p>
          <h2 className="text-2xl font-bold text-emerald-950 mb-6 leading-snug">
            Keep moving on the scholarships with the strongest match score.
          </h2>

          <div className="space-y-0 divide-y divide-black/6">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-4 py-4">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 h-5 w-5 rounded flex items-center justify-center shrink-0 border-2 transition-colors ${
                    task.done
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-emerald-300 bg-transparent'
                  }`}
                >
                  {task.done && (
                    <svg
                      viewBox="0 0 12 10"
                      className="w-3 h-3"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="1,5 4.5,8.5 11,1" />
                    </svg>
                  )}
                </button>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      task.done
                        ? 'line-through text-emerald-900/40'
                        : 'text-emerald-950'
                    }`}
                  >
                    {task.text}
                  </p>
                  <p className="text-xs text-emerald-900/50 mt-0.5">
                    {task.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: '#11382e' }}
          >
            Open full checklist →
          </button>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Saved scholarships dark card */}
          <div
            className="rounded-2xl p-6 text-white"
            style={{ backgroundColor: '#11382e' }}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-emerald-100/70">Saved scholarships</p>
              <span className="text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-emerald-700/50 text-emerald-200">
                SYNCED
              </span>
            </div>
            <p className="text-5xl font-bold text-white mb-2">18</p>
            <p className="text-sm text-emerald-100/60">
              Last sync on May 26, 2026
            </p>
          </div>

          {/* Top match card */}
          <div
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#f8f4ec' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
              Top Match
            </p>
            <h3 className="text-xl font-bold text-emerald-950 mb-3">
              Aurora Research Award
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-2 rounded-full flex-1"
                style={{ backgroundColor: '#d1fae5' }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{ width: '94%', backgroundColor: '#3ecb78' }}
                />
              </div>
              <span className="text-sm font-semibold text-emerald-700">
                94% match
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-emerald-900/70 mb-5">
              <span>🌍 Austria</span>
              <span>🎓 Full tuition</span>
              <span>⏳ 4 days left</span>
            </div>
            <button
              type="button"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#3ecb78', color: '#0f2a1c' }}
            >
              View &amp; apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
