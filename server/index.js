const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const urlRoutes = require('./routes/url');
const Url = require('./models/Url');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connection.on('connecting', () => {
  console.log('[MongoDB] connecting...');
});

mongoose.connection.on('connected', () => {
  console.log('[MongoDB] connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] connection error:', err.message);
});

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
  } catch (err) {
    console.error('[MongoDB] initial connect failed:', err.message);
  }
};

connectToMongo();

app.use('/api', urlRoutes);

app.get('/:code', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'Please try again shortly.'
      });
    }

    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    url.clicks++;
    url.lastAccessed = new Date();
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error('[GET /:code] error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
