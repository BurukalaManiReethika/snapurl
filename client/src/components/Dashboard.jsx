import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { QRCodeCanvas } from 'qrcode.react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const API = import.meta.env.VITE_API_URL || '/api'

export default function Dashboard() {
  const [urls, setUrls] = useState([])
  const [selectedUrl, setSelectedUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const qrCanvasRef = useRef(null)

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const { data } = await axios.get(`${API}/urls`)
        setUrls(data)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUrls()
  }, [])

  const deleteUrl = async (code) => {
    const confirmed = window.confirm('Are you sure you want to delete this short link?')
    if (!confirmed) return

    await axios.delete(`${API}/urls/${code}`)
    setUrls(current => current.filter(u => u.shortCode !== code))
  }

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text)
  }

  const downloadQrCode = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas')
    if (!canvas || !selectedUrl) {
      return
    }

    const pngUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = pngUrl
    link.download = `snapurl-${selectedUrl.split('/').pop() || 'qrcode'}.png`
    link.click()
  }

  const closeQrModal = () => setSelectedUrl('')

  const chartData = useMemo(() => (
    [...urls]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(({ shortCode, clicks }) => ({ shortCode, clicks }))
  ), [urls])

  return (
    <div className="card">
      <h2>Your Links</h2>

      {isLoading && (
        <div className="skeleton-wrap" aria-label="Loading links">
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
        </div>
      )}

      {!isLoading && chartData.length > 0 && (
        <section className="chart-section" aria-label="Link Performance">
          <h3 className="chart-title">Link Performance</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 10, left: -16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="shortCode" tick={{ fontSize: 12 }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {!isLoading && urls.length === 0 && (
        <div className="empty-state" role="status">
          <p className="empty-emoji">🔗</p>
          <p className="empty-title">No links yet</p>
          <p className="muted">Your shortened links will show up here once you create one.</p>
        </div>
      )}

      {!isLoading && urls.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original</th>
              <th>Clicks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {urls.map(u => (
              <tr key={u.shortCode}>
                <td>
                  <a href={u.shortUrl} target="_blank" rel="noreferrer">
                    {u.shortUrl}
                  </a>
                </td>
                <td className="truncate">{u.originalUrl}</td>
                <td><span className="badge">{u.clicks}</span></td>
                <td className="actions-cell">
                  <button className="copy-btn" onClick={() => copyToClipboard(u.shortUrl)}>Copy</button>
                  <button className="qr" onClick={() => setSelectedUrl(u.shortUrl)}>
                    QR Code
                  </button>
                  <button className="del" onClick={() => deleteUrl(u.shortCode)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUrl && (
        <div className="modal-backdrop" onClick={closeQrModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>QR Code</h3>
            <p className="muted">Scan to open: {selectedUrl}</p>
            <div className="qr-wrap" ref={qrCanvasRef}>
              <QRCodeCanvas value={selectedUrl} size={220} includeMargin />
            </div>
            <div className="modal-actions">
              <button onClick={downloadQrCode}>Download PNG</button>
              <button className="del" onClick={closeQrModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
