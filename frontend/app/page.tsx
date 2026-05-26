'use client'
import axios from 'axios'

export default function Home() {
  const testConnection = async () => {
    const res = await axios.post('http://localhost:5000/api/recommend', { cgpa: 3.5 })
    alert(JSON.stringify(res.data))
  }

  return (
    <button onClick={testConnection}>Test Full Connection</button>
  )
}