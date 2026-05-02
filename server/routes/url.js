const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const isDbReady = () => mongoose.connection.readyState === 1;

const dbUnavailableResponse = (res) => {
  return res.status(503).json({
    error: 'Database unavailable',
    message: 'MongoDB is not connected. Please try again shortly.'
  });
};

router.post('/shorten', async (req, res) => {
  try {
    if (!isDbReady()) return dbUnavailableResponse(res);

    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: 'URL required' });

    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const shortCode = nanoid(6);
    const url = await Url.create({ originalUrl, shortCode });
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    return res.json({ shortUrl, shortCode, originalUrl: url.originalUrl, clicks: 0 });
  } catch (err) {
    console.error('[POST /api/shorten] error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/urls', async (req, res) => {
  try {
    if (!isDbReady()) return dbUnavailableResponse(res);

    const urls = await Url.find().sort({ createdAt: -1 }).limit(20);
    return res.json(urls.map((u) => ({
      originalUrl: u.originalUrl,
      shortCode: u.shortCode,
      shortUrl: `${process.env.BASE_URL}/${u.shortCode}`,
      clicks: u.clicks,
      createdAt: u.createdAt
    })));
  } catch (err) {
    console.error('[GET /api/urls] error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/urls/:code', async (req, res) => {
  try {
    if (!isDbReady()) return dbUnavailableResponse(res);

    await Url.deleteOne({ shortCode: req.params.code });
    return res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/urls/:code] error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
