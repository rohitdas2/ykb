import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      if (!email || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      // Simulated API call
      setTimeout(() => {
        console.log('Email login:', { email, password });
        setLoading(false);
        // For now, redirect to phone verification
        setPhoneNumber('');
        navigate('/verify');
      }, 1000);
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePhoneSignUp = () => {
    setPhoneNumber('');
    navigate('/verify');
  };

  const handleGuestLogin = () => {
    setGuestMode();
    navigate('/home');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Ranks & Takes</h1>
          <p>Better Rankings Through Subjectivity & Numbers</p>
        </div>

        <form onSubmit={handleEmailLogin} className="auth-form">
          <h2>Login</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">or</div>

        <div className="phone-signup">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePhoneSignUp}
          >
            Sign Up with Phone Number
          </button>
        </div>

        <div className="divider">or</div>

        <div className="guest-login">
          <button
            type="button"
            className="btn btn-guest"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </button>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <a href="#signup">Sign up</a></p>
          <p><a href="#forgot">Forgot password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
