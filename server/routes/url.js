const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

router.post('/shorten', async (req, res) => {
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

  res.json({ shortUrl, shortCode, originalUrl, clicks: 0 });
});

router.get('/urls', async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 }).limit(20);
  res.json(urls.map(u => ({
    originalUrl: u.originalUrl,
    shortCode: u.shortCode,
    shortUrl: `${process.env.BASE_URL}/${u.shortCode}`,
    clicks: u.clicks,
    createdAt: u.createdAt
  })));
});

router.delete('/urls/:code', async (req, res) => {
  await Url.deleteOne({ shortCode: req.params.code });
  res.json({ success: true });
});

module.exports = router;
