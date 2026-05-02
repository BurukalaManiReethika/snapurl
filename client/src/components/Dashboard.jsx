import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Dashboard() {
  const [urls, setUrls] = useState([])

  useEffect(() => {
    axios.get(`${API}/urls`).then(r => setUrls(r.data))
  }, [])

  const deleteUrl = async (code) => {
    await axios.delete(`${API}/urls/${code}`)
    setUrls(urls.filter(u => u.shortCode !== code))
  }

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
              <td>
                <button className="del" onClick={() => deleteUrl(u.shortCode)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
