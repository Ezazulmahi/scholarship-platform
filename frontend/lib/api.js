const BASE_URL = 'http://localhost:5000'

async function request(method, path, body) {
  const res = await fetch(BASE_URL + path, {
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
