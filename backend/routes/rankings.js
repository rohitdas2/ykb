const express = require('express');
const router = express.Router();
const { all } = require('../config/database');

// Get player rankings
router.get('/players', async (req, res) => {
  try {
    // Mock data for now - will be replaced with actual rankings calculation
    const players = [
      { rank: 1, name: 'Luka Doncic', team: 'Mavericks', score: 9.2, change: '↑ 1' },
      { rank: 2, name: 'Giannis Antetokounmpo', team: 'Bucks', score: 9.0, change: '↓ 1' },
      { rank: 3, name: 'Jayson Tatum', team: 'Celtics', score: 8.9, change: '→' },
      { rank: 4, name: 'Kevin Durant', team: 'Suns', score: 8.7, change: '↑ 2' },
      { rank: 5, name: 'LeBron James', team: 'Lakers', score: 8.5, change: '↓ 1' },
      { rank: 6, name: 'Stephen Curry', team: 'Warriors', score: 8.3, change: '→' },
      { rank: 7, name: 'Joel Embiid', team: '76ers', score: 8.2, change: '↑ 3' },
      { rank: 8, name: 'Damian Lillard', team: 'Trail Blazers', score: 8.0, change: '↓ 2' },
    ];

    res.json({
      success: true,
      rankings: players
    });
  } catch (err) {
    console.error('Get player rankings error:', err);
    res.status(500).json({ error: 'Failed to fetch player rankings' });
  }
});

// Get team rankings
router.get('/teams', async (req, res) => {
  try {
    const teams = [
      { rank: 1, name: 'Boston Celtics', wins: 64, score: 9.1, change: '↑ 2' },
      { rank: 2, name: 'Denver Nuggets', wins: 57, score: 8.9, change: '→' },
      { rank: 3, name: 'Phoenix Suns', wins: 62, score: 8.8, change: '↑ 1' },
      { rank: 4, name: 'Los Angeles Lakers', wins: 56, score: 8.4, change: '↓ 1' },
      { rank: 5, name: 'Golden State Warriors', wins: 46, score: 7.9, change: '→' },
    ];

    res.json({
      success: true,
      rankings: teams
    });
  } catch (err) {
    console.error('Get team rankings error:', err);
    res.status(500).json({ error: 'Failed to fetch team rankings' });
  }
});

// Get trending topics
router.get('/trending', async (req, res) => {
  try {
    const trending = [
      { tag: '#MVPRace', takes: 45230, trend: '↑ 12%', description: 'Who deserves MVP?' },
      { tag: '#CelticsRevolution', takes: 38920, trend: '↑ 8%', description: 'Best team in the league' },
      { tag: '#LakeShow', takes: 32150, trend: '↑ 5%', description: 'Lakers championship' },
      { tag: '#TradeDeadline', takes: 28940, trend: '↑ 15%', description: 'Team upgrades' },
      { tag: '#PlayoffRun', takes: 25100, trend: '→ 2%', description: 'Playoff seeding' },
      { tag: '#Draft2024', takes: 19230, trend: '↑ 22%', description: 'Upcoming draft picks' },
    ];

    res.json({
      success: true,
      trending
    });
  } catch (err) {
    console.error('Get trending error:', err);
    res.status(500).json({ error: 'Failed to fetch trending topics' });
  }
});

// Get user scores/stats
router.get('/user-scores/:userId', async (req, res) => {
  try {
    // Get user's scores
    const scores = [
      { category: 'Accuracy', score: 7.8, description: 'How accurate your takes are' },
      { category: 'Popularity', score: 8.2, description: 'Community engagement' },
      { category: 'Consistency', score: 7.5, description: 'Regular posting' },
      { category: 'Analysis', score: 8.0, description: 'Quality of takes' },
    ];

    res.json({
      success: true,
      scores
    });
  } catch (err) {
    console.error('Get user scores error:', err);
    res.status(500).json({ error: 'Failed to fetch user scores' });
  }
});

module.exports = router;
