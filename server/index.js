const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const urlRoutes = require('./routes/url');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .catch(() => {});

app.use('/api', urlRoutes);

const Url = require('./models/Url');
app.get('/:code', async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });
  if (!url) return res.status(404).json({ error: 'URL not found' });
  url.clicks++;
  url.lastAccessed = new Date();
  await url.save();
  res.redirect(url.originalUrl);
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
