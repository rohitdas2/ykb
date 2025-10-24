# Ranks & Takes Backend

Express.js backend server for the Ranks & Takes sports ranking platform.

## Features

- User authentication (email/password and phone verification)
- SQLite database for data persistence
- JWT token-based authentication
- RESTful API for takes, ratings, and rankings
- CORS enabled for frontend integration

## Tech Stack

- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT + bcryptjs
- **Runtime**: Node.js

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

```bash
npm start
```

The backend will start on `http://localhost:5000`

### 3. Verify Setup

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Ranks & Takes backend is running"
}
```

## Default User Account

A default admin account has been created automatically:

- **Username**: `rohitd`
- **Password**: `rohitd`
- **Display Name**: Rohit Das

You can use these credentials to login to the frontend.

## API Endpoints

### Authentication (`/api/auth`)

#### Email Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "rohit@rankstakes.com",
  "password": "rohitd"
}
```

#### Phone Verification Flow
```
POST /api/auth/send-otp
{
  "phoneNumber": "+1 555 123 4567"
}

POST /api/auth/verify-otp
{
  "phoneNumber": "+1 555 123 4567",
  "otp": "123456"
}

POST /api/auth/register
{
  "username": "newuser",
  "displayName": "New User",
  "phoneNumber": "+1 555 123 4567",
  "email": "user@example.com"
}
```

#### Get Current User (requires auth)
```
GET /api/auth/me
Authorization: Bearer <TOKEN>
```

#### Update Profile (requires auth)
```
PUT /api/auth/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "displayName": "Updated Name"
}
```

### Takes (`/api/takes`)

#### Get All Takes
```
GET /api/takes?limit=20&offset=0&userId=1
```

#### Get Single Take
```
GET /api/takes/:id
```

#### Create Take (requires auth)
```
POST /api/takes
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "content": "Your basketball take here",
  "topic": "NBA"
}
```

#### Rate a Take (requires auth)
```
POST /api/takes/:id/rate
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "score": 8
}
```

#### Like a Take (requires auth)
```
POST /api/takes/:id/like
Authorization: Bearer <TOKEN>
```

### Rankings (`/api/rankings`)

#### Get Player Rankings
```
GET /api/rankings/players
```

#### Get Team Rankings
```
GET /api/rankings/teams
```

#### Get Trending Topics
```
GET /api/rankings/trending
```

#### Get User Scores
```
GET /api/rankings/user-scores/:userId
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
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
```

### Takes Table
```sql
CREATE TABLE takes (
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
```

### Ratings Table
```sql
CREATE TABLE ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  takeId INTEGER NOT NULL,
  score INTEGER NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (takeId) REFERENCES takes(id),
  UNIQUE(userId, takeId)
)
```

### Scores Table
```sql
CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  category TEXT NOT NULL,
  score REAL NOT NULL,
  description TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

## Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── config/
│   └── database.js        # Database initialization
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── takes.js          # Takes/ratings routes
│   └── rankings.js       # Rankings routes
└── middleware/
    └── auth.js           # JWT authentication middleware
```

## Environment Variables

Edit `.env` to configure:

```
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rohit@rankstakes.com","password":"rohitd"}'
```

### Create a Take
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5000/api/takes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Luka is the best player in the NBA","topic":"NBA"}'
```

### Rate a Take
```bash
curl -X POST http://localhost:5000/api/takes/1/rate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"score":9}'
```

## Development Notes

- OTP verification is mocked (returns fixed OTP: `123456`)
- In production, integrate with actual SMS service (Twilio, etc.)
- Database file (`ranks-takes.db`) is created in the backend directory
- All times stored in UTC format

## Next Steps

1. Connect frontend to backend API endpoints
2. Implement real OTP service (Twilio)
3. Add more sophisticated ranking algorithms
4. Implement caching for performance
5. Add more detailed user analytics
6. Implement real-time updates with WebSockets
7. Add email notifications

## Security Notes

- Always use HTTPS in production
- Change JWT_SECRET before deploying
- Use environment variables for sensitive data
- Validate and sanitize all user inputs
- Implement rate limiting
- Add CORS whitelist for production

## Support

For issues or questions, check the frontend README or contact the development team.
