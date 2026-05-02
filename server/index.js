const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const urlRoutes = require('./routes/url');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
