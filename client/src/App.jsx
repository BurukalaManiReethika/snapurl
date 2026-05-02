import { useState } from 'react'
import ShortenerForm from './components/ShortenerForm'
import Dashboard from './components/Dashboard'
import './App.css'

export default function App() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="app">
      <header>
        <h1>⚡ SnapURL</h1>
        <p>Shorten links. Track clicks. Instantly.</p>
      </header>
      <ShortenerForm onShorten={() => setRefresh(r => r + 1)} />
      <Dashboard key={refresh} />
    </div>
  )
}
