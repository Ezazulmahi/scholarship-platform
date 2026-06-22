'use client'

import api from '../lib/api'
import HomeClient from './home-client'

export default function Home() {

  const testConnection = async () => {
    try {
      const res = await api.post('/api/recommend', {
        cgpa: 3.5
      })
      alert(JSON.stringify(res.data, null, 2))
    } catch (err) {
      alert('Error connecting to backend')
      console.error(err)
    }
  }

  return (
    <div>
      <HomeClient />

      {/* Debug Button (can remove later) */}
      <button
        onClick={testConnection}
        style={{
          marginTop: '20px',
          padding: '10px',
          background: 'black',
          color: 'white',
          borderRadius: '8px'
        }}
      >
        Test Full AI Pipeline
      </button>
    </div>
  )
}