import axios from 'axios'

const DEFAULT_API_BASE_URL = 'http://localhost:5000'

function normalizeApiUrl(url?: string) {
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

    return ''
  }

  return process.env.NODE_ENV === 'production' ? '' : DEFAULT_API_BASE_URL
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
})

export default api
