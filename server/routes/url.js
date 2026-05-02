const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: 'URL required' });

    new URL(originalUrl);

    const shortCode = nanoid(6);
    const url = await Url.create({ originalUrl, shortCode });
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    res.json({ shortUrl, shortCode, originalUrl, clicks: url.clicks });
  } catch (err) {
    if (err instanceof TypeError) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    console.error('[POST /shorten] database error:', err.message);
    res.status(503).json({ error: 'Database unavailable. Please try again later.' });
  }
});

router.get('/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }).limit(20);
    res.json(urls.map(u => ({
      originalUrl: u.originalUrl,
      shortCode: u.shortCode,
      shortUrl: `${process.env.BASE_URL}/${u.shortCode}`,
      clicks: u.clicks,
      createdAt: u.createdAt
    })));
  } catch (err) {
    console.error('[GET /urls] database error:', err.message);
    res.status(503).json({ error: 'Database unavailable. Please try again later.' });
  }
});

router.delete('/urls/:code', async (req, res) => {
  try {
    await Url.deleteOne({ shortCode: req.params.code });
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /urls/:code] database error:', err.message);
    res.status(503).json({ error: 'Database unavailable. Please try again later.' });
  }
});

module.exports = router;
