'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Navbar from '../../components/Navbar'

type User = { id: string; name: string; email: string }

const countryData = {
  Austria: {
    flag: '🇦🇹',
    path: 'MSc Admission Path',
    steps: 5,
    timeline: '~6 months',
    timelineNote: 'Apply 8–10 months before intake',
    steps_list: [
      {
        n: 1,
        title: 'Pick programme & check entry',
        desc: 'Confirm your CGPA meets the minimum and the language of instruction (English-taught vs German).',
      },
      {
        n: 2,
        title: 'Prepare documents',
        desc: 'Transcript, degree certificate, CV, SOP, 2 LORs, IELTS/TOEFL, passport. Some need notarised + Apostille.',
      },
      {
        n: 3,
        title: 'Apply online + pay fee',
        desc: 'Submit via the university portal. Track admission letter (Zulassungsbescheid).',
      },
      {
        n: 4,
        title: 'Student visa (D-visa)',
        desc: 'Show proof of funds (~€1,200/mo), insurance, accommodation, admission letter at the Austrian embassy.',
      },
      {
        n: 5,
        title: 'Residence permit on arrival',
        desc: 'Register address & convert to residence permit within the first weeks.',
      },
    ],
    docs: ['Transcript', 'Degree cert', 'SOP', '2× LOR', 'IELTS 6.5+', 'Passport', 'Apostille', 'Proof of funds'],
    tip: "Austria's blocked-account proof and Apostille can take 3–4 weeks — start these before you even get the admission letter.",
  },
  Italy: {
    flag: '🇮🇹',
    path: 'MSc Admission Path',
    steps: 4,
    timeline: '~5 months',
    timelineNote: 'Apply via universitaly.it portal',
    steps_list: [
      { n: 1, title: 'Apply via Universitaly', desc: 'Submit pre-enrolment form and documents on universitaly.it before the deadline.' },
      { n: 2, title: 'Dichiarazione di Valore', desc: 'Get your degree recognised via the Italian embassy in your home country.' },
      { n: 3, title: 'Student visa (Type D)', desc: 'Attend visa appointment with acceptance + proof of funds (€6,079/yr min).' },
      { n: 4, title: 'Permesso di Soggiorno', desc: 'Register for residence permit within 8 days of arrival at police HQ.' },
    ],
    docs: ['Transcript', 'Degree cert', 'Dichiarazione di Valore', 'SOP', '2× LOR', 'IELTS 6+', 'Passport'],
    tip: 'The Dichiarazione di Valore from the Italian embassy can take 2–3 months. Start immediately after admission.',
  },
  UK: {
    flag: '🇬🇧',
    path: "Master's Admission Path",
    steps: 4,
    timeline: '~4 months',
    timelineNote: 'Apply through university directly',
    steps_list: [
      { n: 1, title: 'Apply via university portal', desc: 'Submit application with all documents. Some universities use a common portal.' },
      { n: 2, title: 'Accept offer + pay deposit', desc: 'Confirm your place and pay any required tuition deposit.' },
      { n: 3, title: 'Student visa (CAS)', desc: 'Get your Confirmation of Acceptance for Studies and apply for a Student visa.' },
      { n: 4, title: 'NHS surcharge + biometrics', desc: 'Pay Immigration Health Surcharge and complete biometric appointment.' },
    ],
    docs: ['Transcript', 'Degree cert', 'SOP', '2× LOR', 'IELTS 6.5+', 'Passport', 'Bank statement', 'CAS number'],
    tip: 'Apply for the Student visa no earlier than 6 months before your course start date. Allow 3 weeks for processing.',
  },
  USA: {
    flag: '🇺🇸',
    path: "Master's/PhD Admission Path",
    steps: 5,
    timeline: '~8 months',
    timelineNote: 'Apply Oct–Jan for fall intake',
    steps_list: [
      { n: 1, title: 'Research programmes + GRE', desc: 'GRE scores required by many programmes. Take it 3+ months before applying.' },
      { n: 2, title: 'Submit applications', desc: 'Apply via each university portal. Pay application fee ($50–$100 each).' },
      { n: 3, title: 'Accept offer + I-20', desc: 'Choose programme, pay deposit, receive I-20 from the university.' },
      { n: 4, title: 'F-1 visa + SEVIS', desc: 'Pay SEVIS fee, schedule visa interview, show I-20 + financial proof.' },
      { n: 5, title: 'Port of entry', desc: 'Carry I-20 and all docs. Enter no earlier than 30 days before programme starts.' },
    ],
    docs: ['Transcript', 'Degree cert', 'SOP', '3× LOR', 'GRE scores', 'TOEFL/IELTS', 'Passport', 'I-20', 'SEVIS receipt'],
    tip: 'US visa interviews are in high demand. Book your appointment slot as soon as you receive the I-20, months in advance.',
  },
  Germany: {
    flag: '🇩🇪',
    path: 'MSc Admission Path',
    steps: 5,
    timeline: '~7 months',
    timelineNote: 'Apply via uni-assist for many universities',
    steps_list: [
      { n: 1, title: 'Apply via uni-assist / portal', desc: 'Many German universities use uni-assist. Submit transcripts (with certified translations).' },
      { n: 2, title: 'Get blocked account (Sperrkonto)', desc: 'Open a blocked bank account with ~€11,208 — required for visa.' },
      { n: 3, title: 'Language cert + APS', desc: 'Bangladeshi students need APS certificate. German or English cert depending on programme.' },
      { n: 4, title: 'Student visa', desc: 'Submit visa at German embassy with blocked account, APS, and admission letter.' },
      { n: 5, title: 'Anmeldung on arrival', desc: 'Register address (Anmeldung) within 2 weeks. Required for all residents.' },
    ],
    docs: ['Transcript', 'Degree cert', 'APS cert', 'SOP', '2× LOR', 'German B2 / IELTS 6.5+', 'Passport', 'Blocked account proof'],
    tip: 'The APS certificate (for Bangladeshi students) takes 4–6 weeks and requires submitting original documents.',
  },
}

type CountryKey = keyof typeof countryData

export default function ApplyClient() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeCountry, setActiveCountry] = useState<CountryKey>('Austria')

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => router.replace('/'))
  }, [router])

  if (!user) return null

  const country = countryData[activeCountry]

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
        <div className="flex gap-2 mb-8 flex-wrap">
          {(Object.keys(countryData) as CountryKey[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCountry(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                activeCountry === c ? 'text-white' : 'text-emerald-950 hover:bg-white/60'
              }`}
              style={{
                backgroundColor: activeCountry === c ? '#11382e' : '#f8f4ec',
              }}
            >
              {countryData[c].flag} {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-6 items-start">
          {/* Steps card */}
          <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
              {activeCountry.toUpperCase()} · {country.path.toUpperCase()}
            </p>
            <h2 className="text-2xl font-bold text-emerald-950 mb-7">
              {country.steps} steps · {country.timeline} timeline
            </h2>

            <div className="space-y-0">
              {country.steps_list.map((step, i) => (
                <div key={step.n} className={`flex gap-4 ${i < country.steps_list.length - 1 ? 'pb-6' : ''}`}>
                  <div className="flex flex-col items-center gap-0">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                      style={{ backgroundColor: i === 0 ? '#11382e' : '#3ecb78', color: i === 0 ? 'white' : '#0f2a1c' }}
                    >
                      {step.n}
                    </div>
                    {i < country.steps_list.length - 1 && (
                      <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: '#d1fae5', minHeight: '24px' }} />
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
              <p className="text-4xl font-bold mb-2">{country.timeline}</p>
              <p className="text-sm text-emerald-100/60">{country.timelineNote}</p>
            </div>

            {/* Required documents */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-4">
                Required Documents
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {country.docs.map((doc) => (
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

            {/* Key tip */}
            <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#f8f4ec' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2">
                Key Tip
              </p>
              <p className="text-sm text-emerald-900/70 leading-relaxed">{country.tip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
