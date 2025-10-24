const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run, all } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Email Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Try to find user by email or username
    const user = await get(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Phone Login (OTP simulation)
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    // In production, send actual SMS
    // For now, return a mock OTP
    const otp = '123456';
    res.json({
      success: true,
      message: 'OTP sent',
      otp: otp, // Only for demo - never return OTP in production!
      expiresIn: 600
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and Phone
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP required' });
    }

    // In production, verify actual OTP
    if (otp !== '123456') {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    res.json({
      success: true,
      message: 'OTP verified',
      phoneNumber
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Register new user (after phone verification)
router.post('/register', async (req, res) => {
  try {
    const { username, displayName, phoneNumber, email, password } = req.body;

    if (!username || !displayName) {
      return res.status(400).json({ error: 'Username and display name required' });
    }

    // Check if username exists
    const existingUser = await get(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = bcrypt.hashSync(password || 'temp', 10);

    const result = await run(
      `INSERT INTO users (username, displayName, phoneNumber, email, password, isVerified)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [username, displayName, phoneNumber, email || '', hashedPassword]
    );

    const token = generateToken(result.lastID);

    res.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: result.lastID,
        username,
        displayName,
        phoneNumber,
        email,
        isVerified: 1,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await get(
      'SELECT id, username, displayName, email, phoneNumber, isVerified, createdAt FROM users WHERE id = ?',
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { displayName, bio, favoriteTeam } = req.body;

    await run(
      `UPDATE users SET displayName = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [displayName, req.userId]
    );

    const user = await get(
      'SELECT id, username, displayName, email, phoneNumber FROM users WHERE id = ?',
      [req.userId]
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
