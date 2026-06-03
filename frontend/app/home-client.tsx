'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '../lib/api'

const featuredScholarships = [
  {
    name: 'Global STEM Grant',
    deadline: 'June 14',
    amount: '$12,000',
    tag: 'Engineering',
  },
  {
    name: 'Future Leaders Fund',
    deadline: 'June 28',
    amount: '$8,500',
    tag: 'Leadership',
  },
  {
    name: 'Community Impact Award',
    deadline: 'July 05',
    amount: '$5,000',
    tag: 'Social Work',
  },
]

const dashboardHighlights = [
  'Smart profile completion guidance',
  'Deadline-focused application board',
  'Saved awards with quick compare views',
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
]

type AuthMode = 'login' | 'signup' | 'verify' | 'forgot' | 'reset'

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7A3 3 0 0 0 9 12a3 3 0 0 0 4.3 2.7" />
      <path d="M6.7 6.8C4.2 8.4 2.6 11 2 12c1.2 2 4.6 6 10 6 1.7 0 3.2-.4 4.5-1" />
      <path d="M14.8 5.4A10.5 10.5 0 0 1 22 12c-.4.7-1.7 2.9-4.2 4.6" />
    </svg>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <article className="rounded-3xl border border-[#ddcfb1] bg-[#f7edd8] p-4 text-emerald-950 shadow-lg shadow-emerald-950/10 backdrop-blur sm:p-5">
      <p className="text-sm text-emerald-900/70">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </article>
  )
}

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  isPasswordVisible,
  onToggleVisibility,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  isPasswordVisible?: boolean
  onToggleVisibility?: () => void
}) {
  const isPasswordField = type === 'password'

  return (
    <label className="grid gap-2 text-sm">
      <span className="text-emerald-100/85">{label}</span>
      <div className="relative">
        <input
          type={
            isPasswordField && isPasswordVisible !== undefined
              ? isPasswordVisible
                ? 'text'
                : 'password'
              : type
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none transition placeholder:text-emerald-100/45 focus:border-[#f4b860] focus:bg-white/12 ${
            isPasswordField ? 'w-full pr-14' : 'w-full'
          }`}
          placeholder={placeholder}
        />
        {isPasswordField && onToggleVisibility ? (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-emerald-100/75 transition hover:text-white"
            aria-label={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
            aria-pressed={Boolean(isPasswordVisible)}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
    </label>
  )
}

export default function HomeClient() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [verifyEmail, setVerifyEmail] = useState('')
  const [verifyOtp, setVerifyOtp] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetOtp, setResetOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    'Log in with your registered email, or create a new student account to continue.'
  )

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    if (nextMode === 'login') setStatusMessage('Welcome back. Log in with your registered email and password.')
    if (nextMode === 'signup') setStatusMessage('Create your account using your registered email address.')
    if (nextMode === 'verify') setStatusMessage('Enter the OTP sent to your email to verify the account.')
    if (nextMode === 'forgot') setStatusMessage('Request an OTP to reset your password securely.')
    if (nextMode === 'reset') setStatusMessage('Enter the OTP and choose a new password to finish resetting.')
  }

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setStatusMessage('Enter your registered email and password to continue.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/login', { email: loginEmail.trim(), password: loginPassword })
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = (err as { response?: { data?: { error?: string; needsVerification?: boolean } } }).response?.data
      if (error?.needsVerification) {
        setVerifyEmail(loginEmail.trim())
        changeMode('verify')
      } else {
        setStatusMessage(error?.error || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSignupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setStatusMessage('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', {
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      })
      setVerifyEmail(signupEmail.trim())
      changeMode('verify')
      setStatusMessage('OTP sent to your email. Enter it below to verify your account.')
    } catch (err: unknown) {
      const error = (err as { response?: { data?: { error?: string } } }).response?.data
      setStatusMessage(error?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!verifyEmail.trim() || !verifyOtp.trim()) {
      setStatusMessage('Enter your email and the OTP.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/verify-otp', { email: verifyEmail.trim(), otp: verifyOtp.trim() })
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = (err as { response?: { data?: { error?: string } } }).response?.data
      setStatusMessage(error?.error || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!forgotEmail.trim()) {
      setStatusMessage('Enter your registered email.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail.trim() })
      setVerifyEmail(forgotEmail.trim())
      changeMode('reset')
      setStatusMessage('If that email is registered, an OTP has been sent.')
    } catch (err: unknown) {
      const error = (err as { response?: { data?: { error?: string } } }).response?.data
      setStatusMessage(error?.error || 'Failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!resetOtp.trim() || !newPassword || !confirmPassword) {
      setStatusMessage('Please fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        email: verifyEmail.trim(),
        otp: resetOtp.trim(),
        newPassword,
      })
      changeMode('login')
      setStatusMessage('Password reset successful. You can now log in.')
    } catch (err: unknown) {
      const error = (err as { response?: { data?: { error?: string } } }).response?.data
      setStatusMessage(error?.error || 'Reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative isolate overflow-hidden">
      <div className="hero-backdrop absolute inset-x-0 top-0 -z-10 h-200 sm:h-168 lg:h-128" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
        <header className="flex flex-col gap-4 rounded-4xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/70">
              Scholarship Platform
            </p>
            <h1 className="text-lg font-semibold">Student Funding Hub</h1>
          </div>
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <a
              href="#featured"
              className="rounded-full border border-white/35 px-4 py-2 text-center text-sm font-medium transition hover:bg-white/10"
            >
              Featured Awards
            </a>
            <a
              href="#preview"
              className="rounded-full bg-[#f8f1de] px-4 py-2 text-center text-sm font-semibold text-emerald-950 transition hover:bg-white"
            >
              Dashboard Preview
            </a>
          </div>
        </header>

        <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:py-14">
          <div className="space-y-8">
            <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-emerald-200/50 bg-white/75 px-4 py-2 text-sm text-emerald-950 shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="min-w-0">
                Scholarship discovery and application workspace
              </span>
            </div>

            <div className="max-w-3xl space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-900/75">
                Responsive scholarship workspace
              </p>
              <h2 className="max-w-4xl pb-3 text-[2.65rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find scholarships, track deadlines, and manage applications all
                in one place.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-emerald-950/80 sm:text-lg sm:leading-8">
                Create an account, verify your email, and get matched with
                scholarships tailored to your profile.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Open awards" value="128" />
              <StatCard label="Upcoming deadlines" value="09" />
              <StatCard label="Average match score" value="91%" />
            </div>

            <section
              id="preview"
              className="rounded-4xl bg-white/88 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur sm:p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    Dashboard concept
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">
                    A focused workspace for scholarship search, planning, and
                    application momentum.
                  </h3>
                </div>
                <div className="grid w-full gap-3 rounded-3xl bg-[#11382e] p-5 text-white sm:max-w-72">
                  <p className="text-sm text-emerald-100/80">Saved scholarships</p>
                  <p className="text-4xl font-semibold">18</p>
                  <p className="text-sm text-emerald-100/80">
                    Last activity on May 26, 2026
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-3xl bg-[#f6ead1] p-5 text-emerald-950">
                  <p className="text-sm font-medium text-emerald-900/70">
                    Priority checklist
                  </p>
                  <div className="mt-4 grid gap-3">
                    {dashboardHighlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-emerald-900/10 bg-white/65 px-4 py-3"
                      >
                        {item}
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

          <aside className="rounded-4xl border border-white/15 bg-[#fffaf0] p-4 shadow-2xl shadow-emerald-950/20 sm:p-5">
            <div className="rounded-3xl bg-[#11382e] p-5 text-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-emerald-100/80">Secure access</p>
                  <p className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
                    Student account access
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  Auth
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {([
                  ['login', 'Log in'],
                  ['signup', 'Sign up'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeMode(value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      mode === value ||
                      (value === 'login' &&
                        (mode === 'forgot' || mode === 'reset')) ||
                      (value === 'signup' && mode === 'verify')
                        ? 'bg-[#f8f1de] text-emerald-950'
                        : 'bg-white/10 text-emerald-100 hover:bg-white/15'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-50/90">
                {statusMessage}
              </p>

              {mode === 'login' ? (
                <form className="mt-6 grid gap-4" onSubmit={handleLoginSubmit}>
                  <Field
                    label="Registered email"
                    type="email"
                    placeholder="student@example.com"
                    value={loginEmail}
                    onChange={setLoginEmail}
                  />
                  <Field
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    isPasswordVisible={showLoginPassword}
                    onToggleVisibility={() =>
                      setShowLoginPassword((current) => !current)
                    }
                  />
                  <div className="-mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => changeMode('forgot')}
                      className="text-sm text-emerald-100/80 transition hover:text-white"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#f8f1de] px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? 'Logging in…' : 'Log in'}
                  </button>
                </form>
              ) : null}

              {mode === 'signup' ? (
                <form className="mt-6 grid gap-4" onSubmit={handleSignupSubmit}>
                  <Field
                    label="Full name"
                    placeholder="Student name"
                    value={signupName}
                    onChange={setSignupName}
                  />
                  <Field
                    label="Registered email"
                    type="email"
                    placeholder="your.registered@email.com"
                    value={signupEmail}
                    onChange={setSignupEmail}
                  />
                  <Field
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={setSignupPassword}
                    isPasswordVisible={showSignupPassword}
                    onToggleVisibility={() =>
                      setShowSignupPassword((current) => !current)
                    }
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#f8f1de] px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </form>
              ) : null}

              {mode === 'verify' ? (
                <form className="mt-6 grid gap-4" onSubmit={handleVerifySubmit}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-emerald-100/80">
                      Verify your email with OTP
                    </p>
                    <button
                      type="button"
                      onClick={() => changeMode('signup')}
                      className="text-sm text-emerald-100/80 transition hover:text-white"
                    >
                      Back to sign up
                    </button>
                  </div>
                  <Field
                    label="Registered email"
                    type="email"
                    placeholder="student@example.com"
                    value={verifyEmail}
                    onChange={setVerifyEmail}
                  />
                  <Field
                    label="Email verification OTP"
                    placeholder="Enter 6-digit OTP"
                    value={verifyOtp}
                    onChange={setVerifyOtp}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#f8f1de] px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? 'Verifying…' : 'Verify email'}
                  </button>
                </form>
              ) : null}

              {mode === 'forgot' ? (
                <form className="mt-6 grid gap-4" onSubmit={handleForgotSubmit}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-emerald-100/80">
                      Reset password with OTP
                    </p>
                    <button
                      type="button"
                      onClick={() => changeMode('login')}
                      className="text-sm text-emerald-100/80 transition hover:text-white"
                    >
                      Back to log in
                    </button>
                  </div>
                  <Field
                    label="Registered email"
                    type="email"
                    placeholder="student@example.com"
                    value={forgotEmail}
                    onChange={setForgotEmail}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#f8f1de] px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                </form>
              ) : null}

              {mode === 'reset' ? (
                <form className="mt-6 grid gap-4" onSubmit={handleResetSubmit}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-emerald-100/80">
                      Complete password reset
                    </p>
                    <button
                      type="button"
                      onClick={() => changeMode('login')}
                      className="text-sm text-emerald-100/80 transition hover:text-white"
                    >
                      Back to log in
                    </button>
                  </div>
                  <Field
                    label="Reset OTP"
                    placeholder="Enter OTP"
                    value={resetOtp}
                    onChange={setResetOtp}
                  />
                  <Field
                    label="New password"
                    type="password"
                    placeholder="Create a new password"
                    value={newPassword}
                    onChange={setNewPassword}
                    isPasswordVisible={showNewPassword}
                    onToggleVisibility={() =>
                      setShowNewPassword((current) => !current)
                    }
                  />
                  <Field
                    label="Confirm password"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    isPasswordVisible={showConfirmPassword}
                    onToggleVisibility={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#f8f1de] px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? 'Resetting…' : 'Reset password'}
                  </button>
                </form>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-3xl bg-[#f6ead1] p-5 text-emerald-950">
                <p className="text-sm font-medium text-emerald-900/70">
                  Included flows
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Login, sign up, email OTP verification, forgot password, and
                  password reset.
                </p>
              </article>
              <article className="rounded-3xl border border-[#eadfcb] bg-white p-5 text-emerald-950">
                <p className="text-sm font-medium text-emerald-900/70">
                  Session
                </p>
                <p className="mt-2 text-sm leading-6">
                  After login or verification, a secure httpOnly cookie keeps
                  your session alive for 7 days.
                </p>
              </article>
            </div>
          </aside>
        </section>

        <section
          id="featured"
          className="grid gap-6 rounded-4xl bg-white/85 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur sm:p-6 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Featured Scholarships
            </p>
            <h3 className="text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">
              Browse open awards before signing up.
            </h3>
            <p className="text-base leading-7 text-slate-600">
              Students can explore the platform, understand the product
              direction, and preview the interface across desktop and mobile.
            </p>
          </div>

          <div className="grid gap-4">
            {featuredScholarships.map((scholarship) => (
              <article
                key={scholarship.name}
                className="grid gap-4 rounded-3xl border border-emerald-100 bg-[#fcfaf5] p-5 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    {scholarship.tag}
                  </div>
                  <h4 className="mt-3 text-xl font-semibold text-emerald-950">
                    {scholarship.name}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600">
                    Priority candidate match with essay and profile review
                    completed.
                  </p>
                </div>
                <div className="flex items-end justify-between gap-6 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Award</p>
                    <p className="text-2xl font-semibold text-emerald-950">
                      {scholarship.amount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Deadline</p>
                    <p className="font-semibold text-emerald-900">
                      {scholarship.deadline}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
