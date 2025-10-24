const express = require('express');
const router = express.Router();
const { get, run, all } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get all takes (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0, userId } = req.query;

    let sql = `
      SELECT t.id, t.userId, t.content, t.topic, t.likes, t.commentCount, t.createdAt,
             u.username, u.displayName, u.avatar,
             AVG(r.score) as averageRating,
             COUNT(r.id) as ratingsCount
      FROM takes t
      LEFT JOIN users u ON t.userId = u.id
      LEFT JOIN ratings r ON t.id = r.takeId
    `;
    let params = [];

    if (userId) {
      sql += ' WHERE t.userId = ?';
      params.push(userId);
    }

    sql += ' GROUP BY t.id ORDER BY t.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const takes = await all(sql, params);

    res.json({
      success: true,
      takes: takes || []
    });
  } catch (err) {
    console.error('Get takes error:', err);
    res.status(500).json({ error: 'Failed to fetch takes' });
  }
});

// Get single take
router.get('/:id', async (req, res) => {
  try {
    const take = await get(
      `SELECT t.*, u.username, u.displayName
       FROM takes t
       LEFT JOIN users u ON t.userId = u.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (!take) {
      return res.status(404).json({ error: 'Take not found' });
    }

    const ratings = await all(
      'SELECT score FROM ratings WHERE takeId = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      take: {
        ...take,
        ratings: ratings || []
      }
    });
  } catch (err) {
    console.error('Get take error:', err);
    res.status(500).json({ error: 'Failed to fetch take' });
  }
});

// Create a new take
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, topic } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Take content required' });
    }

    const result = await run(
      `INSERT INTO takes (userId, content, topic)
       VALUES (?, ?, ?)`,
      [req.userId, content, topic || 'General']
    );

    const take = await get(
      `SELECT t.*, u.username, u.displayName
       FROM takes t
       LEFT JOIN users u ON t.userId = u.id
       WHERE t.id = ?`,
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      take
    });
  } catch (err) {
    console.error('Create take error:', err);
    res.status(500).json({ error: 'Failed to create take' });
  }
});

// Rate a take
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { score } = req.body;
    const takeId = req.params.id;

    if (!score || score < 1 || score > 10) {
      return res.status(400).json({ error: 'Score must be between 1 and 10' });
    }

    // Check if take exists
    const take = await get('SELECT id FROM takes WHERE id = ?', [takeId]);
    if (!take) {
      return res.status(404).json({ error: 'Take not found' });
    }

    // Insert or update rating
    await run(
      `INSERT INTO ratings (userId, takeId, score)
       VALUES (?, ?, ?)
       ON CONFLICT(userId, takeId) DO UPDATE SET score = ?`,
      [req.userId, takeId, score, score]
    );

    // Get updated take with ratings
    const updatedTake = await get(
      `SELECT t.*,
              AVG(r.score) as averageRating,
              COUNT(r.id) as ratingsCount
       FROM takes t
       LEFT JOIN ratings r ON t.id = r.takeId
       WHERE t.id = ?
       GROUP BY t.id`,
      [takeId]
    );

    res.json({
      success: true,
      take: updatedTake
    });
  } catch (err) {
    console.error('Rate take error:', err);
    res.status(500).json({ error: 'Failed to rate take' });
  }
});

// Like a take
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const takeId = req.params.id;

    const take = await get('SELECT likes FROM takes WHERE id = ?', [takeId]);
    if (!take) {
      return res.status(404).json({ error: 'Take not found' });
    }

    await run(
      'UPDATE takes SET likes = likes + 1 WHERE id = ?',
      [takeId]
    );

    const updated = await get('SELECT * FROM takes WHERE id = ?', [takeId]);
    res.json({ success: true, take: updated });
  } catch (err) {
    console.error('Like take error:', err);
    res.status(500).json({ error: 'Failed to like take' });
  }
});

module.exports = router;
