const DEFAULT_API_BASE_URL = 'http://localhost:5000'

function normalizeApiUrl(url) {
  return url?.trim().replace(/\/$/, '') || ''
}

function getApiBaseUrl() {
  const configuredUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL)
  if (configuredUrl) return configuredUrl

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return DEFAULT_API_BASE_URL
    }

    throw new Error('NEXT_PUBLIC_API_URL must be set for deployed environments')
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_API_URL must be set for deployed environments')
  }

  return DEFAULT_API_BASE_URL
}

async function request(method, path, body) {
  const res = await fetch(getApiBaseUrl() + path, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed')
    err.response = { data }
    throw err
  }
  return { data }
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
}

export default api
