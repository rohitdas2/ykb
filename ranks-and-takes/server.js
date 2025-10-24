const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database with users table
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      displayName TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      followers INTEGER DEFAULT 0,
      following INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table ready');
      createDefaultUsers();
    }
  });
}

// Create default users
function createDefaultUsers() {
  const users = [
    {
      username: 'tester',
      email: 'tester@example.com',
      password: 'tester123',
      displayName: 'Tester Account',
      avatar: '👤'
    },
    {
      username: 'arnav',
      email: 'arnav@example.com',
      password: 'arnav123',
      displayName: 'Arnav',
      avatar: '👨‍💼'
    },
    {
      username: 'rohit',
      email: 'rohit@example.com',
      password: 'rohit123',
      displayName: 'Rohit',
      avatar: '👨‍💻'
    }
  ];

  users.forEach(user => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, email, password, displayName, avatar) VALUES (?, ?, ?, ?, ?)`,
      [user.username, user.email, hashedPassword, user.displayName, user.avatar],
      (err) => {
        if (err) {
          console.error(`Error inserting user ${user.username}:`, err);
        } else {
          console.log(`User ${user.username} ready`);
        }
      }
    );
  });
}

// API Routes

// Get all users
app.get('/api/users', (req, res) => {
  db.all(`SELECT id, username, email, displayName, avatar, bio, followers, following, createdAt FROM users`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get user by username
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  db.get(
    `SELECT id, username, email, displayName, avatar, bio, followers, following, createdAt FROM users WHERE username = ?`,
    [username],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(row);
      }
    }
  );
});

// Create new user
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
        res.json({
          id: this.lastID,
          username,
          email,
          displayName,
          avatar: avatar || '👤',
          followers: 0,
          following: 0
        });
      }
    }
  );
});

// Update user
app.put('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const { displayName, avatar, bio } = req.body;

  db.run(
    `UPDATE users SET displayName = ?, avatar = ?, bio = ? WHERE username = ?`,
    [displayName, avatar, bio, username],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User updated successfully' });
      }
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get(
    `SELECT id, username, email, displayName, avatar, bio, followers, following FROM users WHERE username = ?`,
    [username],
    (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!user) {
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        // Get the password from database to compare
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

// Delete user
app.delete('/api/users/:username', (req, res) => {
  const { username } = req.params;

  db.run(
    `DELETE FROM users WHERE username = ?`,
    [username],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
