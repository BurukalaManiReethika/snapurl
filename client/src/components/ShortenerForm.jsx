import { useMemo, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function ShortenerForm({ onShorten }) {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const charsSaved = useMemo(() => {
    if (!result?.originalUrl || !result?.shortUrl) return 0
    return Math.max(result.originalUrl.length - result.shortUrl.length, 0)
  }, [result])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setResult(null); setLoading(true)
    try {
      const { data } = await axios.post(`${API}/shorten`, { originalUrl: url })
      setResult(data)
      setUrl('')
      onShorten()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten ⚡'}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <span>Short link:</span>
          <a href={result.shortUrl} target="_blank" rel="noreferrer">
            {result.shortUrl}
          </a>
          <button onClick={() => navigator.clipboard.writeText(result.shortUrl)}>
            Copy
          </button>
          <p className="savings">
            Saved <strong>{charsSaved}</strong> chars ({result.originalUrl.length} → {result.shortUrl.length})
          </p>
        </div>
      )}
    </div>
  )
}
