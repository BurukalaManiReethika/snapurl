import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QRCodeCanvas } from 'qrcode.react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Dashboard() {
  const [urls, setUrls] = useState([])
  const [selectedUrl, setSelectedUrl] = useState('')
  const qrCanvasRef = useRef(null)

  useEffect(() => {
    axios.get(`${API}/urls`).then(r => setUrls(r.data))
  }, [])

  const deleteUrl = async (code) => {
    await axios.delete(`${API}/urls/${code}`)
    setUrls(urls.filter(u => u.shortCode !== code))
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

  return (
    <div className="card">
      <h2>Your Links</h2>
      {urls.length === 0 && (
        <p className="muted">No links yet. Shorten one above!</p>
      )}
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
