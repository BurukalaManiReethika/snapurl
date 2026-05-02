const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const urlRoutes = require('./routes/url');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connection.on('connecting', () => console.log('[MongoDB] connecting...'));
mongoose.connection.on('connected', () => console.log('[MongoDB] connected'));
mongoose.connection.on('disconnected', () => console.log('[MongoDB] disconnected'));
mongoose.connection.on('reconnected', () => console.log('[MongoDB] reconnected'));
mongoose.connection.on('error', (err) => console.error('[MongoDB] connection error:', err.message));

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
  } catch (err) {
    console.error('[MongoDB] initial connection failed:', err.message);
  }
};

connectToMongo();

app.use('/api', urlRoutes);

const Url = require('./models/Url');
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    url.clicks++;
    url.lastAccessed = new Date();
    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    console.error('[Redirect route] database error:', err.message);
    res.status(503).json({ error: 'Database unavailable. Please try again later.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
