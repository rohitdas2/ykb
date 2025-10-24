# Ranks & Takes - Frontend

A React-based social platform for basketball enthusiasts to combine subjective opinions (takes) with objective statistics to create better, more transparent rankings.

## Project Overview

Ranks & Takes is a sports community platform designed to:
- Allow users to post basketball takes (opinions) and rate them on a scale of 1-10
- Combine subjective user ratings with objective NBA statistics
- Create transparent, community-driven rankings of players, teams, and plays
- Foster discussion and debate with social features and mini-games
- Eventually expand to other sports

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios (prepared for API integration)
- **Styling**: CSS3 with responsive design
- **Build Tool**: Create React App (CRA)

## Project Structure

```
src/
├── pages/              # Main page components
│   ├── Login.jsx      # Email/password login
│   ├── PhoneVerification.jsx  # Phone verification & signup flow
│   ├── Home.jsx       # Main feed with takes
│   ├── Rankings.jsx   # Player/team/plays rankings
│   ├── Profile.jsx    # User profile & account
│   ├── Search.jsx     # Search functionality
│   └── Trending.jsx   # Trending topics & players
├── components/        # Reusable components (to be built)
├── store/            # State management (Zustand)
│   └── authStore.js  # Authentication state
├── styles/           # Global & component styles
│   ├── Auth.css      # Login & verification styles
│   └── Pages.css     # Main page styles
├── App.js           # Main app with routing
└── App.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd ranks-and-takes
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Builds the app for production in the `build` folder.

### Running Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

## Current Pages

### Authentication
- **Login** (`/login`) - Email/password authentication
- **Phone Verification** (`/verify`) - Phone signup with OTP verification and profile creation

### Main App (Protected Routes)
- **Home** (`/home`) - Main feed displaying takes from followed users
- **Rankings** (`/rankings`) - Composite rankings (players, teams, plays, draft prospects)
- **Profile** (`/profile`) - User profile, stats, followers, and account settings
- **Search** (`/search`) - Search for players, teams, users, and takes
- **Trending** (`/trending`) - Trending topics, players, and teams

## Key Features Implemented

### Authentication Flow
1. Users can login with email/password
2. Alternatively, sign up with phone number
3. Phone signup includes:
   - Phone number entry
   - OTP verification (6-digit code)
   - Profile creation (username, display name)

### Home Feed
- Display user-generated takes with ratings
- 1-10 rating buttons for each take
- Like and comment functionality (UI ready)
- Trending topics sidebar
- "Who to Follow" suggestions

### Rankings
- Category-based rankings (Players, Teams, Plays, Draft Prospects)
- Display rank, name, team, composite score, and change
- Placeholder sections for empty categories

### Profile
- Display user stats (takes, followers, following, average rating)
- View user's takes
- Edit profile information
- Achievement badges
- Logout functionality

### Search
- Search by player names, teams, usernames, hashtags
- Filter by type (Players, Teams, Users, Takes)
- Recent searches and trending suggestions
- Mock search results

### Trending
- Trending topics with take counts
- Trending players with mention counts
- Trending teams
- Timeframe filters (Last Hour, Today, This Week, This Month)
- Growth trend indicators (↑, ↓, →)

## State Management

Using Zustand for authentication state:

```javascript
useAuthStore((state) => ({
  user,                    // Current user data
  isAuthenticated,         // Auth status
  phoneNumber,            // Phone number during signup
  verificationStep,       // Current step in verification
  setPhoneNumber,         // Set phone number
  setVerificationStep,    // Set verification step
  setUser,               // Set user after auth
  logout                 // Logout function
}))
```

## API Integration Points (TODO)

The following endpoints need to be connected:

1. **Authentication**
   - Email login
   - Phone verification (send OTP)
   - OTP verification
   - User profile creation

2. **Takes & Ratings**
   - Create take
   - Rate take
   - Get takes feed
   - Like take

3. **Rankings**
   - Get player rankings
   - Get team rankings
   - Get best plays
   - Get draft prospects

4. **Profile**
   - Get user profile
   - Update user profile
   - Get user's takes
   - Get user's ratings

5. **Search**
   - Search players/teams/users/takes

6. **Trending**
   - Get trending topics
   - Get trending players
   - Get trending teams

## Styling

All components use a cohesive design system:
- **Primary Color**: #1e3c72, #2a5298 (blue)
- **Text Colors**: #222 (dark), #666 (medium), #999 (light)
- **Background**: #f7f9fa, white cards
- **Borders**: #eee, #ddd
- **Responsive breakpoints**: 1024px, 768px, 480px

## Next Steps

1. **Backend Integration**
   - Set up API client with axios
   - Connect all authentication endpoints
   - Connect feed/takes endpoints
   - Connect rankings API

2. **Enhanced Components**
   - Create take modal
   - Comment/reply system
   - Notification system
   - Mini-games (TTT, Wordle variations)

3. **Features to Add**
   - Follow/unfollow users
   - Direct messaging
   - Notifications
   - Media uploads (images/videos)
   - More granular rankings (by date, by team, etc.)

4. **Testing**
   - Unit tests for components
   - Integration tests for flows
   - E2E tests

5. **Performance**
   - Code splitting
   - Image optimization
   - Lazy loading

## Responsive Design

The app is fully responsive:
- Desktop (1024px+): Full layout with sidebar
- Tablet (768px - 1024px): Adjusted layout, hidden sidebar
- Mobile (<768px): Optimized for touch, stacked layout

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Notes for Future Development

- All API calls are marked with `// TODO:` comments
- Mock data is used in place of actual API responses
- Authentication state persists in memory (add localStorage for persistence)
- Consider adding error boundaries for better error handling
- Add loading states for async operations
- Add toast notifications for user feedback

## Contributing

When adding new features:
1. Create components in the appropriate folder
2. Follow the existing naming conventions
3. Update styles in the corresponding CSS file
4. Add TODO comments for API integration points
5. Use the Zustand store for global state

## License

MIT
