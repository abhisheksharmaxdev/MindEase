const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { env } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const concernRoutes = require('./routes/concernRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const mindmateRoutes = require('./routes/mindmateRoutes');

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/concerns', concernRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/mindmate', mindmateRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Something went wrong.' });
});

module.exports = { app };
