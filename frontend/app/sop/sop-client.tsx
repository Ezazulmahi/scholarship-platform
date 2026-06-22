'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

const tones = ['Academic', 'Personal', 'Ambitious', 'Concise']
const lengths = ['500 words', '800 words', '1000 words']

export default function SopClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [scholarship, setScholarship] = useState('Aurora Research Award — MSc ML, Austria')
  const [motivation, setMotivation] = useState(
    'Want to research efficient ML for low-resource languages, inspired by gaps I saw building NLP tools in Bangla.'
  )
  const [tone, setTone] = useState('Academic')
  const [length, setLength] = useState('800 words')
  const [generating, setGenerating] = useState(false)
  const [draft, setDraft] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/auth/me')
      .then((response: { data: { user: User } }) => setUser(response.data.user))
      .catch(() => router.replace('/'))
  }, [router])

  if (!user) return null

  async function generate() {
    setGenerating(true)
    setDraft('')
    setError('')
    try {
      const target_words = Number.parseInt(length, 10)
      const { data } = await api.post('/ai/sop/generate', {
        scholarship,
        motivation,
        tone,
        length,
        target_words,
        profile: {
          name: user!.name,
          university: 'BRAC University',
          degree: 'BSc in Computer Science & Engineering',
          cgpa: '3.81',
          ielts: '7.5',
          field: 'Machine Learning, Distributed Systems',
        },
      })
      setDraft(data.sop || data.text || '')
      const words = (data.sop || data.text || '').split(/\s+/).filter(Boolean).length
      setWordCount(words)
    } catch (error: unknown) {
      console.error('SOP generation error:', error)
      const apiError = error as {
        response?: { data?: { error?: string; detail?: string } }
        message?: string
      }
      const message =
        apiError.response?.data?.error ||
        apiError.response?.data?.detail ||
        apiError.message ||
        'Something went wrong'
      setError(message)
    } finally {
      setGenerating(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0dbd0' }}>
      <Navbar activePage="sop" userName={user.name} />

      {/* Hero */}
      <div style={{ backgroundColor: '#173825' }} className="px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            · AI · RAG-Powered
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Statement of Purpose generator.
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            Pulls from your profile + the specific scholarship&apos;s requirements to draft a
            tailored SOP. Edit tone, length, and emphasis — regenerate any paragraph.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10 py-8 grid grid-cols-[1fr_1fr] gap-6 items-start">
        {/* Inputs */}
        <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-5">
            Inputs
          </p>

          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-emerald-900/70">
                Target scholarship / programme
              </span>
              <input
                className="w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none focus:border-emerald-500 transition-colors"
                value={scholarship}
                onChange={(e) => setScholarship(e.target.value)}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-emerald-900/70">
                What&apos;s your core motivation?
              </span>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none focus:border-emerald-500 transition-colors resize-none"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-emerald-900/70">Tone</span>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      tone === t
                        ? 'text-white'
                        : 'border border-emerald-900/20 text-emerald-950 hover:bg-emerald-50'
                    }`}
                    style={tone === t ? { backgroundColor: '#11382e' } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-emerald-900/70">Length</span>
              <div className="flex flex-wrap gap-2">
                {lengths.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      length === l
                        ? 'text-white'
                        : 'border border-emerald-900/20 text-emerald-950 hover:bg-emerald-50'
                    }`}
                    style={length === l ? { backgroundColor: '#11382e' } : {}}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
              style={{ backgroundColor: '#11382e' }}
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Generating…
                </>
              ) : (
                '✦ Generate SOP'
              )}
            </button>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <p className="text-xs text-emerald-900/50">
              Auto-filled from your profile: CGPA 3.81, IELTS 7.5, BRAC University, ML focus.
            </p>
          </div>
        </div>

        {/* Draft output */}
        <div
          className="rounded-2xl min-h-125 flex flex-col p-7 shadow-sm"
          style={{ backgroundColor: '#f8f4ec' }}
        >
          {draft ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full text-emerald-800"
                  style={{ backgroundColor: '#d1fae5' }}
                >
                  Draft V1 · Generated
                </span>
                <span className="text-sm text-emerald-900/50">{wordCount} words</span>
              </div>
              <div className="flex-1 text-sm text-emerald-950 leading-relaxed whitespace-pre-line overflow-y-auto max-h-96 pr-2">
                {draft}
              </div>
              <div className="mt-6 pt-5 border-t border-emerald-900/10 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#3ecb78', color: '#0f2a1c' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={generate}
                  className="py-3 rounded-xl text-sm font-semibold border border-emerald-900/20 text-emerald-950 hover:bg-emerald-50 transition-colors"
                >
                  Regenerate
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-emerald-900/40 gap-3">
              <div className="text-4xl">✦</div>
              <p className="text-sm">
                Fill in the inputs and click Generate SOP — your tailored draft will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}