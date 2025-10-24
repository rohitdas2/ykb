const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const takesRoutes = require('./routes/takes');
const rankingsRoutes = require('./routes/rankings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/takes', takesRoutes);
app.use('/api/rankings', rankingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ranks & Takes backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Ranks & Takes backend running on http://localhost:${PORT}`);
});
