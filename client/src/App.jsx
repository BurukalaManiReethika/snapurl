import { useEffect, useState } from 'react'
import ShortenerForm from './components/ShortenerForm'
import Dashboard from './components/Dashboard'
import './App.css'

export default function App() {
  const [refresh, setRefresh] = useState(0)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timeout)
  }, [toast])

  const handleShortenSuccess = () => {
    setRefresh(r => r + 1)
    setToast('✅ URL shortened successfully!')
  }

  return (
    <div className="app">
      <header>
        <h1>⚡ SnapURL</h1>
        <p>Shorten links. Track clicks. Instantly.</p>
      </header>
      <ShortenerForm onShorten={handleShortenSuccess} />
      <Dashboard key={refresh} />

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
