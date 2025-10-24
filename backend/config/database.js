const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../ranks-takes.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        displayName TEXT NOT NULL,
        phoneNumber TEXT,
        password TEXT NOT NULL,
        isVerified INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Takes table
    db.run(`
      CREATE TABLE IF NOT EXISTS takes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        content TEXT NOT NULL,
        topic TEXT,
        likes INTEGER DEFAULT 0,
        commentCount INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Ratings table
    db.run(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        takeId INTEGER NOT NULL,
        score INTEGER NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (takeId) REFERENCES takes(id),
        UNIQUE(userId, takeId)
      )
    `);

    // Scores table (for tracking user ratings/scores)
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        category TEXT NOT NULL,
        score REAL NOT NULL,
        description TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Create default admin user if doesn't exist
    const username = 'rohitd';
    const password = 'rohitd';
    const displayName = 'Rohit Das';

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
      if (!row) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.run(
          `INSERT INTO users (username, displayName, password, isVerified, email)
           VALUES (?, ?, ?, 1, ?)`,
          [username, displayName, hashedPassword, 'rohit@rankstakes.com'],
          (err) => {
            if (err) {
              console.error('Error creating default user:', err);
            } else {
              console.log('✓ Default user "rohitd" created');
            }
          }
        );
      }
    });

    console.log('✓ Database initialized');
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  initializeDatabase,
  run,
  get,
  all
};
