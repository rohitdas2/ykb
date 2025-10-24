# Ranks & Takes - Complete Setup Guide

## Project Overview

Ranks & Takes is a full-stack web application that combines subjective user opinions (takes) with objective statistics to create better, more transparent sports rankings. Currently focused on basketball.

## What's Been Built

### Frontend (React)
- ✅ 7 pages: Home, Rankings, Profile, Search, Trending, Login, Phone Verification
- ✅ Guest mode access
- ✅ New Scores tab on Home page with user stats visualization
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional UI with consistent design system
- ✅ State management with Zustand
- ✅ React Router navigation with protected routes

### Backend (Express.js + SQLite)
- ✅ Express server running on port 5000
- ✅ SQLite database with 4 tables (users, takes, ratings, scores)
- ✅ Authentication system (email/password and phone OTP)
- ✅ JWT token-based authentication
- ✅ API endpoints for takes, ratings, rankings, user management
- ✅ Default user account created: username `rohitd`, password `rohitd`
- ✅ CORS enabled for frontend communication

## File Structure

```
ykb/
├── ranks-and-takes/          # Frontend (React)
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state management
│   │   ├── styles/           # CSS files
│   │   ├── config/           # API configuration
│   │   ├── App.js            # Main app with routing
│   │   └── index.js
│   ├── package.json
│   ├── README.md
│   ├── GETTING_STARTED.md
│   └── .env                  # Frontend environment variables
│
└── backend/                  # Backend (Express.js)
    ├── server.js             # Main server file
    ├── config/
    │   └── database.js       # SQLite setup and init
    ├── routes/
    │   ├── auth.js
    │   ├── takes.js
    │   └── rankings.js
    ├── middleware/
    │   └── auth.js           # JWT middleware
    ├── package.json
    ├── .env                  # Backend environment variables
    ├── README.md
    └── ranks-takes.db        # SQLite database (auto-created)
```

## Quick Start

### 1. Start the Backend

Open a terminal and run:

```bash
cd /Users/rohitdas/ykb/backend
npm start
```

You should see:
```
✓ Database initialized
✓ Default user "rohitd" created
🚀 Ranks & Takes backend running on http://localhost:5000
```

### 2. Start the Frontend

Open another terminal and run:

```bash
cd /Users/rohitdas/ykb/ranks-and-takes
npm start
```

The frontend will open at `http://localhost:3000`

### 3. Login

You have 3 options:

**Option A: Continue as Guest**
- Click "Continue as Guest" to browse the app without account
- All pages accessible
- Limited functionality (no posting/rating)

**Option B: Login with Email**
- Use the default account:
  - Email: `rohit@rankstakes.com`
  - Password: `rohitd`

**Option C: Sign up with Phone**
- Click "Sign Up with Phone Number"
- Enter any phone number format (e.g., +1 555 123 4567)
- Enter OTP: `123456` (any 6 digits work for testing)
- Create username and display name
- Auto-logged in

## Features

### Frontend Features

1. **Home Page**
   - Takes feed with community takes
   - 1-10 rating buttons for each take
   - Like and comment functionality
   - **NEW**: Scores tab showing user stats
   - Trending topics sidebar
   - Who to follow suggestions

2. **Scores Tab** (NEW!)
   - Display 4 user score categories:
     - Accuracy (7.8/10)
     - Popularity (8.2/10)
     - Consistency (7.5/10)
     - Analysis (8.0/10)
   - Visual progress bars for each score
   - Summary stats (avg score, total takes, rank, followers)
   - Responsive card layout

3. **Rankings Page**
   - Player rankings with scores
   - Team rankings with win records
   - Tabs for: Players, Teams, Best Plays, Draft Prospects
   - Trending contributors sidebar

4. **Profile Page**
   - User avatar and stats
   - Display takes with ratings
   - Edit profile functionality
   - View followers
   - Logout button

5. **Search Page**
   - Search players, teams, users, takes
   - Filter by type
   - Recent searches and trending suggestions
   - Mock search results

6. **Trending Page**
   - Trending topics with take counts
   - Trending players with mention counts
   - Trending teams
   - Timeframe filters (hour, day, week, month)
   - Growth indicators (↑↓→)

7. **Authentication**
   - Email/password login
   - Phone number sign up with OTP
   - Profile creation
   - Protected routes
   - Guest mode access

### Backend Features

1. **Authentication API**
   - Email login
   - Phone OTP verification
   - User registration
   - Profile updates
   - JWT token generation

2. **Takes API**
   - Create takes
   - Rate takes (1-10)
   - Like takes
   - Get takes feed with ratings

3. **Rankings API**
   - Get player rankings
   - Get team rankings
   - Get trending topics
   - Get user scores

## Default Credentials

```
Username: rohitd
Password: rohitd
Email: rohit@rankstakes.com
Display Name: Rohit Das
```

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=ranks-takes-secret-key-change-in-production
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Email login
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - Create new user
- `GET /api/auth/me` - Get current user (requires auth)

### Takes
- `GET /api/takes` - Get all takes
- `POST /api/takes` - Create take (requires auth)
- `POST /api/takes/:id/rate` - Rate take (requires auth)
- `POST /api/takes/:id/like` - Like take (requires auth)

### Rankings
- `GET /api/rankings/players` - Get player rankings
- `GET /api/rankings/teams` - Get team rankings
- `GET /api/rankings/trending` - Get trending topics
- `GET /api/rankings/user-scores/:userId` - Get user scores

## Development Tips

### Accessing Developer Tools
- **Frontend**: DevTools available in browser (F12)
- **Backend**: Check terminal logs for request/response info
- **Database**: SQLite file at `/Users/rohitdas/ykb/backend/ranks-takes.db`

### Mock Data
- Sample takes on Home page
- Sample rankings on Rankings page
- Sample trending data on Trending page
- OTP for testing: `123456`

### Creating New Users
Send a POST request to register endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "displayName": "Test User",
    "phoneNumber": "+1 555 123 4567",
    "email": "test@example.com"
  }'
```

## Frontend Components

### Pages
- `src/pages/Login.jsx` - Login page
- `src/pages/PhoneVerification.jsx` - Phone signup flow
- `src/pages/Home.jsx` - Home feed with scores tab
- `src/pages/Rankings.jsx` - Rankings by category
- `src/pages/Profile.jsx` - User profile
- `src/pages/Search.jsx` - Search functionality
- `src/pages/Trending.jsx` - Trending topics/players

### State Management
- `src/store/authStore.js` - Authentication state with Zustand

### Styles
- `src/styles/Auth.css` - Login/signup styles
- `src/styles/Pages.css` - Main page styles (includes scores styles)

### Config
- `src/config/api.js` - API client with axios

## Next Steps

### Immediate
1. Connect frontend forms to backend API
2. Test full authentication flow
3. Integrate takes feed with backend
4. Connect rating functionality

### Short Term
1. Add create take modal
2. Implement follow/unfollow
3. Add comment system
4. Implement notification system

### Medium Term
1. Add mini-games (TTT, Wordle, etc.)
2. Implement real OTP with Twilio
3. Add media uploads
4. Implement caching for performance

### Long Term
1. Real-time updates with WebSockets
2. Advanced ranking algorithms
3. Analytics dashboard
4. Mobile app version
5. Expand to other sports

## Troubleshooting

### Backend won't start
- Check if port 5000 is in use: `lsof -i :5000`
- Kill process: `kill -9 <PID>`
- Ensure Node.js is installed: `node --version`

### Frontend shows blank page
- Check browser console for errors (F12)
- Make sure backend is running on port 5000
- Clear cache: `Ctrl+Shift+Delete`

### Login fails
- Check that backend is running
- Verify credentials: `rohitd` / `rohitd`
- Check browser console for error messages

### Database issues
- Database file automatically created on first run
- To reset: delete `backend/ranks-takes.db` and restart backend

## Support & Documentation

- **Frontend**: See `ranks-and-takes/README.md` and `GETTING_STARTED.md`
- **Backend**: See `backend/README.md`
- **Architecture**: See root `CLAUDE.md`

## Project Stats

- **Frontend**: 7 pages, 2500+ lines of code
- **Backend**: 3 route modules, 2 middleware, database setup
- **Styling**: 1400+ lines of responsive CSS
- **Database**: 4 tables with relationships

## Notes

- Database uses SQLite for simplicity (can upgrade to PostgreSQL for production)
- Authentication uses JWT tokens (stored in localStorage on frontend)
- Phone OTP is mocked (returns 123456) - replace with Twilio in production
- All API errors return structured JSON responses
- Frontend has built-in error handling and validation

Happy development! 🚀
