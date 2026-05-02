<div align="center">

<img src="https://img.shields.io/badge/SnapURL-URL%20Shortener-2563eb?style=for-the-badge&logo=lightning&logoColor=white" />

# ⚡ SnapURL

### A blazing-fast URL shortener with real-time click analytics

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Railway-8B5CF6?style=flat&logo=railway&logoColor=white)](https://railway.app)

<br/>

[🚀 Live Demo](https://your-live-url.railway.app) · [🐛 Report Bug](https://github.com/YOUR_USERNAME/snapurl/issues) · [✨ Request Feature](https://github.com/YOUR_USERNAME/snapurl/issues)

<br/>

![SnapURL Screenshot](https://placehold.co/860x400/2563eb/white?text=SnapURL+Dashboard)

</div>

---

## ✨ Features

- 🔗 **Instant URL Shortening** — Paste any URL, get a short link in milliseconds
- 📊 **Click Analytics** — Track how many times each link was clicked
- 📋 **One-Click Copy** — Copy short links to clipboard instantly
- 🗑️ **Link Management** — Delete links you no longer need
- 📱 **Fully Responsive** — Works perfectly on mobile, tablet, and desktop
- ⚡ **Blazing Fast** — Built with Vite + Express for maximum performance

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| ID Generation | Nanoid |
| Deployment | Railway |

---

## 📁 Project Structure

```
snapurl/
├── 📂 server/
│   ├── 📂 models/
│   │   └── Url.js          # MongoDB schema
│   ├── 📂 routes/
│   │   └── url.js          # REST API routes
│   ├── index.js            # Express server entry
│   └── package.json
├── 📂 client/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── ShortenerForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org) v18 or higher
- [npm](https://npmjs.com) v8 or higher
- A free [MongoDB Atlas](https://mongodb.com/atlas) account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/snapurl.git
cd snapurl
```

### 2. Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/snapurl
PORT=5000
BASE_URL=http://localhost:5000
```

Start the server:

```bash
node index.js
```

### 3. Set up the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

### 4. Open the app

```
http://localhost:5173
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/shorten` | Shorten a URL |
| `GET` | `/api/urls` | Get all shortened URLs |
| `DELETE` | `/api/urls/:code` | Delete a URL |
| `GET` | `/:code` | Redirect to original URL |

### Example Request

```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.google.com"}'
```

### Example Response

```json
{
  "shortUrl": "http://localhost:5000/aB3xYz",
  "shortCode": "aB3xYz",
  "originalUrl": "https://www.google.com",
  "clicks": 0
}
```

---

## ☁️ Deployment

This repository includes a `render.yaml` blueprint for deploying both services on **Render**.

1. Push this repository to GitHub.
2. In Render, choose **New +** → **Blueprint** and select your repo.
3. Render will create both `snapurl-backend` and `snapurl-frontend` services from `render.yaml`.
4. Set backend environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `BASE_URL` = your backend public URL (for example, `https://snapurl-backend.onrender.com`)
   - `PORT` is optional (Render provides one automatically)
5. Set frontend environment variable:
   - `VITE_API_URL` = `https://<your-backend-domain>/api`
6. Redeploy both services.

After deploy:
- Frontend: `https://<your-frontend-domain>`
- API health: `https://<your-backend-domain>/api/health`

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ by [Your Name](https://github.com/YOUR_USERNAME)

⭐ Star this repo if you found it helpful!

</div>
