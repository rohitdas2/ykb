# Getting Started with Ranks & Takes

## Quick Start

### 1. Start the Development Server
```bash
cd ranks-and-takes
npm start
```

The app will open at `http://localhost:3000`

### 2. Test the Authentication Flow

**Login Screen**
- Navigate to `/login`
- Try logging in with any email/password (currently not connected to backend)
- Or click "Sign Up with Phone Number"

**Phone Verification Flow**
- Enter a phone number (e.g., +1 555 123 4567)
- Click "Send Code"
- Enter a 6-digit code (any numbers work)
- Click "Verify Code"
- Create a profile with username and display name
- You'll be logged in and redirected to the Home page

### 3. Explore the App

Once logged in, you can navigate to:
- **Home** - Main feed with sample takes
- **Rankings** - Player and team rankings
- **Trending** - Trending topics and players
- **Search** - Search functionality
- **Profile** - Your user profile

## File Structure Overview

```
src/
├── pages/                  # All page components
│   ├── Login.jsx          # Login page
│   ├── PhoneVerification.jsx
│   ├── Home.jsx           # Main feed
│   ├── Rankings.jsx       # Rankings page
│   ├── Profile.jsx        # User profile
│   ├── Search.jsx         # Search page
│   └── Trending.jsx       # Trending page
│
├── store/
│   └── authStore.js       # Zustand auth state
│
├── styles/
│   ├── Auth.css           # Auth page styles
│   └── Pages.css          # Main page styles
│
├── App.js                 # Main app with routing
└── App.css                # Global styles
```

## Common Development Tasks

### Adding a New Page

1. Create a new file in `src/pages/YourPage.jsx`
2. Import necessary dependencies
3. Add the route in `src/App.js`
4. Add navigation link in the header

### Adding a New Component

1. Create `src/components/YourComponent.jsx`
2. Import and use in pages
3. Add component-specific styles to `Pages.css` or create a new CSS file

### Connecting to Backend API

1. Open the page component
2. Look for `// TODO:` comments (these mark API integration points)
3. Replace mock functions with axios calls
4. Update the state management as needed

Example:
```javascript
// Current (mock):
// TODO: Replace with actual API call
console.log('Sending OTP to:', phoneNumber);

// After API integration:
import axios from 'axios';
axios.post('/api/auth/send-otp', { phoneNumber })
  .then(response => {
    // Handle response
  })
```

### Managing State

Use the auth store for authentication:

```javascript
import { useAuthStore } from '../store/authStore';

// In your component:
const user = useAuthStore((state) => state.user);
const setUser = useAuthStore((state) => state.setUser);

// Or multiple state items:
const { user, isAuthenticated, logout } = useAuthStore();
```

## Navigation

The app uses React Router with protected routes:
- Public routes: `/login`, `/verify`
- Protected routes: `/home`, `/rankings`, `/profile`, `/search`, `/trending`

Unauthenticated users are automatically redirected to `/login`.

## Styling

All styles are in CSS files:
- `Auth.css` - Login and verification screens
- `Pages.css` - All main page components

The design system uses:
- Primary blue: `#1e3c72` and `#2a5298`
- Neutral grays for text and backgrounds
- Responsive grid layouts

## Testing the UI

The app comes with mock data for:
- Takes feed (Home page)
- Player/team rankings (Rankings page)
- Trending topics and players (Trending page)
- Search results (Search page)
- User profile (Profile page)

You can modify the mock data in the page components to test different scenarios.

## Responsive Design

The app is fully responsive. Test on different screen sizes:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (<768px)

Browser DevTools responsive design mode is helpful for this.

## Next Steps

1. **Set up backend server** - Create API endpoints for:
   - Authentication (login, phone verification, OTP)
   - Takes and ratings
   - User profiles
   - Rankings
   - Search
   - Trending

2. **Connect frontend to backend** - Update all `// TODO:` marked sections

3. **Add more components** - Create reusable components for:
   - Take creation modal
   - Comment/reply system
   - Follow buttons
   - Notification system

4. **Implement missing features**:
   - Mini-games
   - Direct messaging
   - Media uploads
   - Real-time updates (WebSocket)

5. **Add tests** - Unit and integration tests

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
npm start
```

### Dependencies not installed
```bash
npm install
```

### App not updating after changes
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Restart the development server

### React Router issues
- Make sure all pages are imported in `App.js`
- Check that routes match the page component paths

## Support

For questions or issues:
1. Check the README.md for detailed feature documentation
2. Look at existing page components for patterns
3. Review the Zustand store for state management examples
4. Check console for error messages
