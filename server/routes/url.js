const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);

router.get('/health', async (_req, res) => {
  try {
    return res.json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'URL required' });
    }

    if (!isHttpUrl(originalUrl)) {
      return res.status(400).json({ error: 'URL must start with http:// or https://' });
    }

    try {
      new URL(originalUrl);
    } catch (_parseError) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const shortCode = nanoid(6);
    const url = await Url.create({ originalUrl, shortCode });
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    return res.json({
      shortUrl,
      shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks ?? 0
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/urls', async (_req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }).limit(20);

    return res.json(urls.map((u) => ({
      originalUrl: u.originalUrl,
      shortCode: u.shortCode,
      shortUrl: `${process.env.BASE_URL}/${u.shortCode}`,
      clicks: u.clicks,
      createdAt: u.createdAt
    })));
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/urls/:code', async (req, res) => {
  try {
    await Url.deleteOne({ shortCode: req.params.code });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
