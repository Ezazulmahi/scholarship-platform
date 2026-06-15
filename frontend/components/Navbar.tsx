'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '../lib/api'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', key: 'dashboard' },
  { label: 'Profile', href: '/profile', key: 'profile' },
  { label: 'SOP Generator', href: '/sop', key: 'sop' },
  { label: 'Costing', href: '/costing', key: 'costing' },
  { label: 'Scholarships', href: '/scholarships', key: 'scholarships' },
  { label: 'Apply by Country', href: '/apply', key: 'apply' },
  { label: 'Counselling', href: '/counselling', key: 'counselling' },
]

type NavbarProps = {
  activePage: string
  userName: string
}

export default function Navbar({ activePage, userName }: NavbarProps) {
  const router = useRouter()

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleLogout() {
    try {
      await api.post('/auth/logout', {})
    } catch {
      // ignore
    }
    router.push('/')
  }

  return (
    <nav
      className="sticky top-0 z-50 flex items-center gap-6 px-8 py-3"
      style={{ backgroundColor: '#173825' }}
    >
      <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
        <span
          className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: '#3ecb78', color: '#0f2a1c' }}
        >
          S
        </span>
        <span className="text-white font-semibold text-[15px] tracking-tight">
          ScholarPath
        </span>
      </Link>

      <div className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activePage === item.key
                ? 'font-semibold text-emerald-950'
                : 'text-white/75 hover:text-white hover:bg-white/8'
            }`}
            style={
              activePage === item.key
                ? { backgroundColor: '#3ecb78', color: '#0f2a1c' }
                : {}
            }
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ backgroundColor: '#c5a55a', color: '#17352e' }}
        >
          {initials}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}
