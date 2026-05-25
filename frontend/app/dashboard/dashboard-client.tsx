'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const SESSION_EMAIL_KEY = 'scholarship-platform-user-email'

const dashboardStats = [
  { label: 'Profile strength', value: '92%' },
  { label: 'Open applications', value: '6' },
  { label: 'Upcoming deadlines', value: '3' },
]

const dashboardTasks = [
  'Finish your personal statement draft',
  'Upload the updated transcript PDF',
  'Review eligibility notes for the STEM shortlist',
]

const dashboardMatches = [
  {
    id: 'aurora',
    name: 'Aurora Research Fellowship',
    amount: '$10,500',
    deadline: 'July 12',
  },
  {
    id: 'atlas',
    name: 'Atlas Mobility Scholarship',
    amount: '$7,200',
    deadline: 'July 19',
  },
  {
    id: 'north-star',
    name: 'North Star Leadership Award',
    amount: '$5,400',
    deadline: 'July 26',
  },
]

function DashboardStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <article className="rounded-3xl border border-[#ddcfb1] bg-[#f7edd8] p-5 text-emerald-950 shadow-lg shadow-emerald-950/8">
      <p className="text-sm text-emerald-900/70">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </article>
  )
}

function getDisplayName(email: string) {
  const localPart = email.split('@')[0] || 'student'
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function DashboardClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const savedEmail = window.localStorage.getItem(SESSION_EMAIL_KEY)

    if (!savedEmail) {
      router.replace('/')
      return
    }

    setEmail(savedEmail)
  }, [router])

  function handleLogout() {
    window.localStorage.removeItem(SESSION_EMAIL_KEY)
    router.push('/')
  }

  const displayName = getDisplayName(email)

  return (
    <main className="relative isolate overflow-hidden">
      <div className="hero-backdrop absolute inset-x-0 top-0 -z-10 h-128" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-4xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/70">
              Scholarship Platform
            </p>
            <h1 className="text-lg font-semibold">Your Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/35 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              Back to home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-[#f8f1de] px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-white"
            >
              Log out
            </button>
          </div>
        </header>

        <section className="grid flex-1 gap-6 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:py-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200/50 bg-white/75 px-4 py-2 text-sm text-emerald-950 shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Signed in as {email || 'your registered email'}
            </div>

            <div className="max-w-3xl space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-900/75">
                Personal dashboard
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Welcome back, {displayName || 'Student'}.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-emerald-950/80">
                Your scholarship workspace is ready with active matches,
                upcoming deadlines, and the next actions to finish this week.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {dashboardStats.map((stat) => (
                <DashboardStat
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>

            <section className="rounded-4xl bg-white/88 p-6 shadow-xl shadow-emerald-950/10 backdrop-blur">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    This week
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
                    Keep moving on the scholarships with the strongest match
                    score.
                  </h3>
                </div>
                <div className="grid min-w-56 gap-3 rounded-3xl bg-[#11382e] p-5 text-white">
                  <p className="text-sm text-emerald-100/80">Saved scholarships</p>
                  <p className="text-4xl font-semibold">18</p>
                  <p className="text-sm text-emerald-100/80">
                    Last sync on May 26, 2026
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-3xl bg-[#f6ead1] p-5 text-emerald-950">
                  <p className="text-sm font-medium text-emerald-900/70">
                    Priority checklist
                  </p>
                  <div className="mt-4 grid gap-3">
                    {dashboardTasks.map((task) => (
                      <div
                        key={task}
                        className="rounded-2xl border border-emerald-900/10 bg-white/65 px-4 py-3"
                      >
                        {task}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  {dashboardMatches.map((match) => (
                    <article
                      key={match.id}
                      className="rounded-3xl border border-emerald-100 bg-[#fcfaf5] p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-sm text-slate-500">
                            Matched scholarship
                          </p>
                          <h4 className="mt-2 text-xl font-semibold text-emerald-950">
                            {match.name}
                          </h4>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-slate-500">Award</p>
                          <p className="text-2xl font-semibold text-emerald-950">
                            {match.amount}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-slate-600">
                        Deadline:{' '}
                        <span className="font-semibold">{match.deadline}</span>
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="rounded-4xl border border-white/15 bg-[#fffaf0] p-5 shadow-2xl shadow-emerald-950/20">
            <div className="rounded-3xl bg-[#11382e] p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-emerald-100/80">Account</p>
                  <p className="mt-2 text-2xl font-semibold sm:text-3xl">
                    {displayName || 'Student'} workspace
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  Active
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                <article className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-sm text-emerald-100/75">Registered email</p>
                  <p className="mt-2 text-base font-medium text-white">
                    {email || 'student@example.com'}
                  </p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-sm text-emerald-100/75">Next milestone</p>
                  <p className="mt-2 text-base font-medium text-white">
                    Submit two shortlists before the next deadline window
                  </p>
                </article>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-3xl bg-[#f6ead1] p-5 text-emerald-950">
                <p className="text-sm font-medium text-emerald-900/70">
                  Dashboard access
                </p>
                <p className="mt-2 text-lg font-semibold">
                  After login, the user is redirected here immediately.
                </p>
              </article>
              <article className="rounded-3xl border border-[#eadfcb] bg-white p-5 text-emerald-950">
                <p className="text-sm font-medium text-emerald-900/70">
                  Frontend note
                </p>
                <p className="mt-2 text-sm leading-6">
                  This dashboard uses the signed-in email stored in local
                  storage, so the flow already behaves like a simple frontend
                  session.
                </p>
              </article>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
