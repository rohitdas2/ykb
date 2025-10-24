# Ranks & Takes Backend Server

## Setup

The backend is built with Express.js and SQLite.

### Installation

Dependencies are already installed with:
```bash
npm install
```

### Running the Server

To start the backend server:
```bash
npm run server
```

The server will start on `http://localhost:5000`

## Database

SQLite database is automatically created at `database.db` when the server starts.

### Users Table

The following users are automatically created:
- **tester** (tester@example.com) - Password: `tester123`
- **arnav** (arnav@example.com) - Password: `arnav123`
- **rohit** (rohit@example.com) - Password: `rohit123`

## API Endpoints

### Notifications

#### Get user notifications
```
GET /api/notifications/:userId
```

#### Create notification
```
POST /api/notifications
Content-Type: application/json

{
  "userId": 1,
  "type": "mention|follow|like|trending",
  "user": "Sports Analyst",
  "action": "mentioned you in a take",
  "message": "optional message",
  "avatar": "👨‍💼"
}
```

#### Mark notification as read
```
PUT /api/notifications/:notificationId/read
```

#### Delete notification
```
DELETE /api/notifications/:notificationId
```

### Players

#### Get all players
```
GET /api/players
```

#### Get player by name
```
GET /api/players/:playerName
```

#### Get team roster
```
GET /api/players/team/:teamName
```

### Teams

#### Get all teams
```
GET /api/teams
```

#### Get team by name
```
GET /api/teams/:teamName
```

#### Get conference standings
```
GET /api/teams/conference/East
GET /api/teams/conference/West
```

### Users

#### Get all users
```
GET /api/users
```

#### Get user by username
```
GET /api/users/:username
```

#### Create new user
```
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "displayName": "New User",
  "avatar": "👤"
}
```

#### Update user
```
PUT /api/users/:username
Content-Type: application/json

{
  "displayName": "Updated Name",
  "avatar": "👨‍💼",
  "bio": "User bio"
}
```

#### Login
```
POST /api/login
Content-Type: application/json

{
  "username": "tester",
  "password": "tester123"
}
```

#### Delete user
```
DELETE /api/users/:username
```

#### Health check
```
GET /api/health
```

## Database Fields

Users table has the following fields:
- `id` - Auto-incrementing primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password (bcrypt)
- `displayName` - Display name
- `avatar` - User avatar emoji
- `bio` - User bio
- `followers` - Number of followers
- `following` - Number of users following
- `createdAt` - Account creation timestamp
