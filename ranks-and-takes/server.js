const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database with all tables
function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      displayName TEXT NOT NULL,
      avatar TEXT,
      banner TEXT,
      bio TEXT,
      followers INTEGER DEFAULT 0,
      following INTEGER DEFAULT 0,
      ballKnowledge INTEGER DEFAULT 50,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
    else console.log('✓ Users table ready');
    createDefaultUsers();
  });

  // Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      user TEXT NOT NULL,
      action TEXT NOT NULL,
      message TEXT,
      avatar TEXT,
      read INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating notifications table:', err);
    else console.log('✓ Notifications table ready');
    createDefaultNotifications();
  });

  // Players table
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playerName TEXT NOT NULL,
      team TEXT NOT NULL,
      position TEXT NOT NULL,
      number INTEGER,
      height TEXT,
      weight INTEGER,
      dateOfBirth TEXT,
      college TEXT,
      ppg REAL DEFAULT 0,
      rpg REAL DEFAULT 0,
      apg REAL DEFAULT 0,
      spg REAL DEFAULT 0,
      bpg REAL DEFAULT 0,
      fgPercent REAL DEFAULT 0,
      threePercent REAL DEFAULT 0,
      ftPercent REAL DEFAULT 0,
      plusMinus REAL DEFAULT 0,
      gamesPlayed INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) console.error('Error creating players table:', err);
    else console.log('✓ Players table ready');
    populatePlayersAndTeams();
  });

  // Teams table
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamName TEXT UNIQUE NOT NULL,
      abbreviation TEXT UNIQUE NOT NULL,
      city TEXT NOT NULL,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      winPercent REAL DEFAULT 0,
      pointsPerGame REAL DEFAULT 0,
      pointsAllowedPerGame REAL DEFAULT 0,
      conference TEXT NOT NULL,
      division TEXT NOT NULL,
      logoUrl TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating teams table:', err);
    else console.log('✓ Teams table ready');
  });
}

// Create default users
function createDefaultUsers() {
  const users = [
    { username: 'tester', email: 'tester@example.com', password: 'tester123', displayName: 'Tester Account', avatar: '👤', ballKnowledge: 75 },
    { username: 'arnav', email: 'arnav@example.com', password: 'arnav123', displayName: 'Arnav', avatar: '👨‍💼', ballKnowledge: 85 },
    { username: 'rohit', email: 'rohit@example.com', password: 'rohit123', displayName: 'Rohit', avatar: '👨‍💻', ballKnowledge: 92 }
  ];

  users.forEach(user => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, email, password, displayName, avatar, ballKnowledge) VALUES (?, ?, ?, ?, ?, ?)`,
      [user.username, user.email, hashedPassword, user.displayName, user.avatar, user.ballKnowledge],
      (err) => {
        if (!err) console.log(`  → User ${user.username} ready (Ball Knowledge: ${user.ballKnowledge})`);
      }
    );
  });
}

// Create default notifications
function createDefaultNotifications() {
  // Get user IDs for notifications (assuming tester user has id=1)
  db.get(`SELECT id FROM users WHERE username = 'tester'`, (err, user) => {
    if (user) {
      const notifications = [
        { userId: user.id, type: 'mention', user: 'Sports Analyst', action: 'mentioned you in a take', message: '"@user thoughts on MVP race?"', avatar: '👨‍💼' },
        { userId: user.id, type: 'follow', user: 'Basketball Eyes', action: 'started following you', message: '', avatar: '👨‍🦨' },
        { userId: user.id, type: 'like', user: 'Hoops Lover', action: 'liked your take', message: '"The Celtics are the most complete team..."', avatar: '👩‍🦱' },
        { userId: user.id, type: 'trending', user: 'System', action: 'your take is trending', message: 'Your take reached 1000 engagements', avatar: '🔥' }
      ];

      notifications.forEach(notif => {
        db.run(
          `INSERT OR IGNORE INTO notifications (userId, type, user, action, message, avatar, read) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [notif.userId, notif.type, notif.user, notif.action, notif.message, notif.avatar, 0],
          (err) => {
            if (!err) console.log(`  → Notification created for user ${notif.user}`);
          }
        );
      });
    }
  });
}

// Populate NBA players and teams
function populatePlayersAndTeams() {
  // Check if data already exists
  db.get(`SELECT COUNT(*) as count FROM players`, (err, result) => {
    if (result && result.count === 0) {
      console.log('Populating NBA data...');
      insertTeamsData();
      insertPlayersData();
    }
  });
}

function insertTeamsData() {
  const teams = [
    // Eastern Conference - Atlantic
    { teamName: 'Boston Celtics', abbr: 'BOS', city: 'Boston', wins: 64, losses: 18, conf: 'East', div: 'Atlantic' },
    { teamName: 'Brooklyn Nets', abbr: 'BRK', city: 'Brooklyn', wins: 32, losses: 50, conf: 'East', div: 'Atlantic' },
    { teamName: 'New York Knicks', abbr: 'NYK', city: 'New York', wins: 50, losses: 32, conf: 'East', div: 'Atlantic' },
    { teamName: 'Philadelphia 76ers', abbr: 'PHI', city: 'Philadelphia', wins: 41, losses: 41, conf: 'East', div: 'Atlantic' },
    { teamName: 'Toronto Raptors', abbr: 'TOR', city: 'Toronto', wins: 41, losses: 41, conf: 'East', div: 'Atlantic' },
    // Eastern Conference - Central
    { teamName: 'Chicago Bulls', abbr: 'CHI', city: 'Chicago', wins: 39, losses: 43, conf: 'East', div: 'Central' },
    { teamName: 'Cleveland Cavaliers', abbr: 'CLE', city: 'Cleveland', wins: 48, losses: 34, conf: 'East', div: 'Central' },
    { teamName: 'Detroit Pistons', abbr: 'DET', city: 'Detroit', wins: 28, losses: 54, conf: 'East', div: 'Central' },
    { teamName: 'Indiana Pacers', abbr: 'IND', city: 'Indianapolis', wins: 47, losses: 35, conf: 'East', div: 'Central' },
    { teamName: 'Milwaukee Bucks', abbr: 'MIL', city: 'Milwaukee', wins: 59, losses: 23, conf: 'East', div: 'Central' },
    // Eastern Conference - Southeast
    { teamName: 'Atlanta Hawks', abbr: 'ATL', city: 'Atlanta', wins: 36, losses: 46, conf: 'East', div: 'Southeast' },
    { teamName: 'Charlotte Hornets', abbr: 'CHA', city: 'Charlotte', wins: 21, losses: 61, conf: 'East', div: 'Southeast' },
    { teamName: 'Miami Heat', abbr: 'MIA', city: 'Miami', wins: 46, losses: 36, conf: 'East', div: 'Southeast' },
    { teamName: 'Orlando Magic', abbr: 'ORL', city: 'Orlando', wins: 47, losses: 35, conf: 'East', div: 'Southeast' },
    { teamName: 'Washington Wizards', abbr: 'WAS', city: 'Washington', wins: 35, losses: 47, conf: 'East', div: 'Southeast' },
    // Western Conference - Southwest
    { teamName: 'Dallas Mavericks', abbr: 'DAL', city: 'Dallas', wins: 55, losses: 27, conf: 'West', div: 'Southwest' },
    { teamName: 'Houston Rockets', abbr: 'HOU', city: 'Houston', wins: 41, losses: 41, conf: 'West', div: 'Southwest' },
    { teamName: 'Memphis Grizzlies', abbr: 'MEM', city: 'Memphis', wins: 51, losses: 31, conf: 'West', div: 'Southwest' },
    { teamName: 'New Orleans Pelicans', abbr: 'NOP', city: 'New Orleans', wins: 49, losses: 33, conf: 'West', div: 'Southwest' },
    { teamName: 'San Antonio Spurs', abbr: 'SAS', city: 'San Antonio', wins: 22, losses: 60, conf: 'West', div: 'Southwest' },
    // Western Conference - Northwest
    { teamName: 'Denver Nuggets', abbr: 'DEN', city: 'Denver', wins: 57, losses: 25, conf: 'West', div: 'Northwest' },
    { teamName: 'Minnesota Timberwolves', abbr: 'MIN', city: 'Minnesota', wins: 56, losses: 26, conf: 'West', div: 'Northwest' },
    { teamName: 'Oklahoma City Thunder', abbr: 'OKC', city: 'Oklahoma City', wins: 56, losses: 26, conf: 'West', div: 'Northwest' },
    { teamName: 'Portland Trail Blazers', abbr: 'POR', city: 'Portland', wins: 21, losses: 61, conf: 'West', div: 'Northwest' },
    { teamName: 'Utah Jazz', abbr: 'UTA', city: 'Salt Lake City', wins: 37, losses: 45, conf: 'West', div: 'Northwest' },
    // Western Conference - Pacific
    { teamName: 'Golden State Warriors', abbr: 'GSW', city: 'Golden State', wins: 46, losses: 36, conf: 'West', div: 'Pacific' },
    { teamName: 'Los Angeles Clippers', abbr: 'LAC', city: 'Los Angeles', wins: 44, losses: 38, conf: 'West', div: 'Pacific' },
    { teamName: 'Los Angeles Lakers', abbr: 'LAL', city: 'Los Angeles', wins: 47, losses: 35, conf: 'West', div: 'Pacific' },
    { teamName: 'Phoenix Suns', abbr: 'PHX', city: 'Phoenix', wins: 62, losses: 20, conf: 'West', div: 'Pacific' },
    { teamName: 'Sacramento Kings', abbr: 'SAC', city: 'Sacramento', wins: 48, losses: 34, conf: 'West', div: 'Pacific' }
  ];

  teams.forEach(team => {
    db.run(
      `INSERT OR IGNORE INTO teams (teamName, abbreviation, city, wins, losses, winPercent, conference, division) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [team.teamName, team.abbr, team.city, team.wins, team.losses, (team.wins / (team.wins + team.losses)).toFixed(3), team.conf, team.div],
      (err) => {
        if (!err) console.log(`  → ${team.teamName} added`);
      }
    );
  });
}

function insertPlayersData() {
  const players = [
    // Boston Celtics
    { name: 'Jayson Tatum', team: 'Boston Celtics', pos: 'PF', num: 0, ppg: 30.1, rpg: 8.8, apg: 3.6 },
    { name: 'Derrick White', team: 'Boston Celtics', pos: 'PG', num: 9, ppg: 14.2, rpg: 5.2, apg: 2.8 },
    { name: 'Sam Hauser', team: 'Boston Celtics', pos: 'SF', num: 30, ppg: 12.4, rpg: 4.1, apg: 1.2 },
    { name: 'Al Horford', team: 'Boston Celtics', pos: 'C', num: 42, ppg: 9.2, rpg: 6.7, apg: 1.5 },
    { name: 'Jrue Holiday', team: 'Boston Celtics', pos: 'PG', num: 4, ppg: 11.3, rpg: 3.2, apg: 5.9 },
    // Los Angeles Lakers
    { name: 'LeBron James', team: 'Los Angeles Lakers', pos: 'SF', num: 23, ppg: 25.7, rpg: 7.3, apg: 8.9 },
    { name: 'Anthony Davis', team: 'Los Angeles Lakers', pos: 'PF', num: 3, ppg: 27.1, rpg: 12.5, apg: 2.6 },
    { name: 'Austin Reaves', team: 'Los Angeles Lakers', pos: 'SG', num: 15, ppg: 15.9, rpg: 3.7, apg: 3.0 },
    { name: 'D\'Angelo Russell', team: 'Los Angeles Lakers', pos: 'PG', num: 1, ppg: 18.3, rpg: 2.9, apg: 6.2 },
    // Dallas Mavericks
    { name: 'Luka Doncic', team: 'Dallas Mavericks', pos: 'PG', num: 77, ppg: 33.9, rpg: 9.2, apg: 8.0 },
    { name: 'Kyrie Irving', team: 'Dallas Mavericks', pos: 'SG', num: 11, ppg: 24.6, rpg: 3.9, apg: 5.2 },
    { name: 'Derrick Jones Jr.', team: 'Dallas Mavericks', pos: 'SF', num: 5, ppg: 12.1, rpg: 4.8, apg: 1.1 },
    { name: 'P.J. Washington', team: 'Dallas Mavericks', pos: 'PF', num: 25, ppg: 16.2, rpg: 6.4, apg: 1.8 },
    // Milwaukee Bucks
    { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', pos: 'PF', num: 34, ppg: 30.4, rpg: 11.5, apg: 6.5 },
    { name: 'Damian Lillard', team: 'Milwaukee Bucks', pos: 'PG', num: 0, ppg: 24.3, rpg: 3.1, apg: 7.0 },
    { name: 'Khris Middleton', team: 'Milwaukee Bucks', pos: 'SF', num: 22, ppg: 17.8, rpg: 4.9, apg: 3.3 },
    // Denver Nuggets
    { name: 'Nikola Jokic', team: 'Denver Nuggets', pos: 'C', num: 15, ppg: 24.5, rpg: 11.8, apg: 9.8 },
    { name: 'Jamal Murray', team: 'Denver Nuggets', pos: 'PG', num: 27, ppg: 21.4, rpg: 3.5, apg: 6.1 },
    { name: 'Christian Braun', team: 'Denver Nuggets', pos: 'SF', num: 0, ppg: 14.2, rpg: 5.6, apg: 1.5 },
    // Phoenix Suns
    { name: 'Kevin Durant', team: 'Phoenix Suns', pos: 'PF', num: 35, ppg: 29.1, rpg: 6.7, apg: 5.0 },
    { name: 'Devin Booker', team: 'Phoenix Suns', pos: 'SG', num: 1, ppg: 27.1, rpg: 4.5, apg: 6.9 },
    { name: 'Bradley Beal', team: 'Phoenix Suns', pos: 'SG', num: 3, ppg: 18.2, rpg: 3.6, apg: 2.2 },
    // Golden State Warriors
    { name: 'Stephen Curry', team: 'Golden State Warriors', pos: 'PG', num: 30, ppg: 26.4, rpg: 5.1, apg: 6.7 },
    { name: 'Klay Thompson', team: 'Golden State Warriors', pos: 'SG', num: 11, ppg: 17.9, rpg: 3.7, apg: 1.9 },
    { name: 'Andrew Wiggins', team: 'Golden State Warriors', pos: 'SF', num: 22, ppg: 17.1, rpg: 5.3, apg: 1.5 },
    // More players...
    { name: 'Shai Gilgeous-Alexander', team: 'Oklahoma City Thunder', pos: 'PG', num: 2, ppg: 30.1, rpg: 5.5, apg: 6.2 },
    { name: 'Jalen Williams', team: 'Oklahoma City Thunder', pos: 'SF', num: 8, ppg: 21.3, rpg: 5.8, apg: 3.9 },
    { name: 'Luguentz Dort', team: 'Oklahoma City Thunder', pos: 'SG', num: 5, ppg: 17.6, rpg: 4.2, apg: 1.1 },
  ];

  players.forEach(player => {
    db.run(
      `INSERT OR IGNORE INTO players (playerName, team, position, number, ppg, rpg, apg) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [player.name, player.team, player.pos, player.num, player.ppg, player.rpg, player.apg],
      (err) => {
        if (err) console.error(`Error inserting ${player.name}:`, err);
      }
    );
  });

  console.log(`  → ${players.length} players added`);
}

// ============ API ROUTES ============

// USERS
app.get('/api/users', (req, res) => {
  db.all(`SELECT id, username, email, displayName, avatar, banner, bio, followers, following, ballKnowledge, createdAt FROM users`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  db.get(
    `SELECT id, username, email, displayName, avatar, banner, bio, followers, following, ballKnowledge, createdAt FROM users WHERE username = ?`,
    [username],
    (err, row) => {
      if (err) res.status(500).json({ error: err.message });
      else if (!row) res.status(404).json({ error: 'User not found' });
      else res.json(row);
    }
  );
});

// Leaderboard - users by ball knowledge score
app.get('/api/leaderboard', (req, res) => {
  db.all(
    `SELECT id, username, displayName, avatar, ballKnowledge, followers FROM users ORDER BY ballKnowledge DESC LIMIT 100`,
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows || []);
    }
  );
});

app.post('/api/users', (req, res) => {
  const { username, email, password, displayName, avatar } = req.body;
  if (!username || !email || !password || !displayName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run(
    `INSERT INTO users (username, email, password, displayName, avatar) VALUES (?, ?, ?, ?, ?)`,
    [username, email, hashedPassword, displayName, avatar || '👤'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Username or email already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
      } else {
        res.json({ id: this.lastID, username, email, displayName, avatar: avatar || '👤', followers: 0, following: 0 });
      }
    }
  );
});

app.put('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const { displayName, avatar, banner, bio } = req.body;
  db.run(
    `UPDATE users SET displayName = ?, avatar = ?, banner = ?, bio = ? WHERE username = ?`,
    [displayName, avatar, banner, bio, username],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else if (this.changes === 0) res.status(404).json({ error: 'User not found' });
      else res.json({ message: 'User updated successfully' });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  db.get(
    `SELECT id, username, email, displayName, avatar, banner, bio, followers, following, ballKnowledge FROM users WHERE username = ?`,
    [username],
    (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!user) {
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        db.get(
          `SELECT password FROM users WHERE username = ?`,
          [username],
          (err, row) => {
            if (bcrypt.compareSync(password, row.password)) {
              res.json(user);
            } else {
              res.status(401).json({ error: 'Invalid username or password' });
            }
          }
        );
      }
    }
  );
});

app.delete('/api/users/:username', (req, res) => {
  const { username } = req.params;
  db.run(
    `DELETE FROM users WHERE username = ?`,
    [username],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else if (this.changes === 0) res.status(404).json({ error: 'User not found' });
      else res.json({ message: 'User deleted successfully' });
    }
  );
});

// NOTIFICATIONS
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT id, type, user, action, message, avatar, read, createdAt FROM notifications WHERE userId = ? ORDER BY createdAt DESC`,
    [userId],
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows || []);
    }
  );
});

app.post('/api/notifications', (req, res) => {
  const { userId, type, user, action, message, avatar } = req.body;
  if (!userId || !type || !user || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    `INSERT INTO notifications (userId, type, user, action, message, avatar) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, type, user, action, message || '', avatar || '👤'],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, userId, type, user, action, message, avatar, read: 0 });
    }
  );
});

app.put('/api/notifications/:notificationId/read', (req, res) => {
  const { notificationId } = req.params;
  db.run(
    `UPDATE notifications SET read = 1 WHERE id = ?`,
    [notificationId],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else if (this.changes === 0) res.status(404).json({ error: 'Notification not found' });
      else res.json({ message: 'Notification marked as read' });
    }
  );
});

app.delete('/api/notifications/:notificationId', (req, res) => {
  const { notificationId } = req.params;
  db.run(
    `DELETE FROM notifications WHERE id = ?`,
    [notificationId],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else if (this.changes === 0) res.status(404).json({ error: 'Notification not found' });
      else res.json({ message: 'Notification deleted' });
    }
  );
});

// PLAYERS
app.get('/api/players', (req, res) => {
  db.all(`SELECT * FROM players`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows || []);
  });
});

app.get('/api/players/:playerName', (req, res) => {
  const { playerName } = req.params;
  db.get(
    `SELECT * FROM players WHERE playerName LIKE ?`,
    [`%${playerName}%`],
    (err, row) => {
      if (err) res.status(500).json({ error: err.message });
      else if (!row) res.status(404).json({ error: 'Player not found' });
      else res.json(row);
    }
  );
});

app.get('/api/players/team/:teamName', (req, res) => {
  const { teamName } = req.params;
  db.all(
    `SELECT * FROM players WHERE team = ?`,
    [teamName],
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows || []);
    }
  );
});

// TEAMS
app.get('/api/teams', (req, res) => {
  db.all(`SELECT * FROM teams`, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows || []);
  });
});

app.get('/api/teams/:teamName', (req, res) => {
  const { teamName } = req.params;
  db.get(
    `SELECT * FROM teams WHERE teamName LIKE ? OR abbreviation = ?`,
    [`%${teamName}%`, teamName.toUpperCase()],
    (err, row) => {
      if (err) res.status(500).json({ error: err.message });
      else if (!row) res.status(404).json({ error: 'Team not found' });
      else res.json(row);
    }
  );
});

app.get('/api/teams/conference/:conference', (req, res) => {
  const { conference } = req.params;
  db.all(
    `SELECT * FROM teams WHERE conference = ? ORDER BY winPercent DESC`,
    [conference],
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows || []);
    }
  );
});

// TRENDING TAKES - Trending algorithm based on engagement metrics
app.get('/api/trending-takes', (req, res) => {
  // Mock trending takes with engagement scores
  // In a real app, this would calculate based on likes, comments, views, and recency
  const trendingTakes = [
    {
      id: 1,
      author: 'SportsNerd23',
      displayName: 'James Chen',
      avatar: '👨‍🦱',
      take: 'Jayson Tatum is the most underrated two-way player in the NBA right now',
      rank: 8.5,
      ballKnowledge: 78,
      likes: 1523,
      comments: 348,
      views: 15203,
      engagement: 1871,
      trendingScore: 95,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'KnicksFan92',
      displayName: 'Maria Rodriguez',
      avatar: '👩‍🦱',
      take: 'The Knicks will make the Finals within 2 years',
      rank: 7.2,
      ballKnowledge: 72,
      likes: 1412,
      comments: 498,
      views: 12856,
      engagement: 1910,
      trendingScore: 89,
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      author: 'AnalyticsBro',
      displayName: 'Alex Kim',
      avatar: '👨‍💼',
      take: 'Advanced metrics show LeBron is still elite on defense',
      rank: 9.1,
      ballKnowledge: 89,
      likes: 2892,
      comments: 634,
      views: 28903,
      engagement: 3526,
      trendingScore: 98,
      timestamp: '6 hours ago'
    },
    {
      id: 4,
      author: 'HoopsAnalyst',
      displayName: 'Mike Johnson',
      avatar: '📊',
      take: 'Denver Nuggets depth is unmatched in Western Conference',
      rank: 8.8,
      ballKnowledge: 85,
      likes: 987,
      comments: 234,
      views: 9876,
      engagement: 1221,
      trendingScore: 85,
      timestamp: '8 hours ago'
    },
    {
      id: 5,
      author: 'BasketballEyes',
      displayName: 'Sarah Williams',
      avatar: '👀',
      take: 'Shai Gilgeous-Alexander is a top 5 NBA talent',
      rank: 8.3,
      ballKnowledge: 81,
      likes: 1654,
      comments: 412,
      views: 16540,
      engagement: 2066,
      trendingScore: 91,
      timestamp: '12 hours ago'
    }
  ];

  // Sort by trendingScore (engagement + recency weighted algorithm)
  res.json(trendingTakes.sort((a, b) => b.trendingScore - a.trendingScore));
});

// IMAGE UPLOAD ENDPOINTS
// Upload profile picture
app.post('/api/users/:username/avatar', upload.single('avatar'), (req, res) => {
  const { username } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;

  db.run(
    `UPDATE users SET avatar = ? WHERE username = ?`,
    [avatarUrl, username],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        // Delete uploaded file if user not found
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({
          message: 'Avatar uploaded successfully',
          avatarUrl: avatarUrl,
          filename: req.file.filename
        });
      }
    }
  );
});

// Upload banner
app.post('/api/users/:username/banner', upload.single('banner'), (req, res) => {
  const { username } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const bannerUrl = `/uploads/${req.file.filename}`;

  db.run(
    `UPDATE users SET banner = ? WHERE username = ?`,
    [bannerUrl, username],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        // Delete uploaded file if user not found
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({
          message: 'Banner uploaded successfully',
          bannerUrl: bannerUrl,
          filename: req.file.filename
        });
      }
    }
  );
});

// Delete avatar
app.delete('/api/users/:username/avatar', (req, res) => {
  const { username } = req.params;

  db.run(
    `UPDATE users SET avatar = ? WHERE username = ?`,
    [null, username],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'Avatar deleted successfully' });
      }
    }
  );
});

// Delete banner
app.delete('/api/users/:username/banner', (req, res) => {
  const { username } = req.params;

  db.run(
    `UPDATE users SET banner = ? WHERE username = ?`,
    [null, username],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'Banner deleted successfully' });
      }
    }
  );
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}\n`);
});
