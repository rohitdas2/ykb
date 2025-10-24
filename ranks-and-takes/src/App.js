import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import './App.css';

// Pages
import Login from './pages/Login';
import PhoneVerification from './pages/PhoneVerification';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import PlayerStats from './pages/PlayerStats';
import PlayerDetail from './pages/PlayerDetail';
import TeamDetail from './pages/TeamDetail';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Trending from './pages/Trending';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);
  const verificationStep = useAuthStore((state) => state.verificationStep);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated || isGuest ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/verify"
          element={
            isAuthenticated || isGuest ? (
              <Navigate to="/home" replace />
            ) : (
              <PhoneVerification />
            )
          }
        />

        {/* App Routes - Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rankings"
          element={
            <ProtectedRoute>
              <Rankings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player-stats"
          element={
            <ProtectedRoute>
              <PlayerStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={<Navigate to="/trending" replace />}
        />
        <Route
          path="/trending"
          element={
            <ProtectedRoute>
              <Trending />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:playerName"
          element={
            <ProtectedRoute>
              <PlayerDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/:teamCode"
          element={
            <ProtectedRoute>
              <TeamDetail />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home or login */}
        <Route
          path="/"
          element={
            isAuthenticated || isGuest ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
