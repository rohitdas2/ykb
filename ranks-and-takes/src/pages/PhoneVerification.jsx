import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Auth.css';

const PhoneVerification = () => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'profile'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call to send OTP
      console.log('Sending OTP to:', phoneNumber);
      setTimeout(() => {
        setStep('otp');
        setResendTimer(30);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit code');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call to verify OTP
      console.log('Verifying OTP:', otp);
      setTimeout(() => {
        setStep('profile');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username || !displayName) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call to create user
      const userData = {
        username,
        displayName,
        phoneNumber,
        createdAt: new Date(),
      };
      console.log('Creating user:', userData);

      setTimeout(() => {
        setUser(userData);
        setLoading(false);
        navigate('/home');
      }, 1000);
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      setError('');
      console.log('Resending OTP to:', phoneNumber);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Ranks & Takes</h1>
          <p>Better Rankings Through Subjectivity & Numbers</p>
        </div>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="auth-form">
            <h2>Enter Your Phone Number</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
              />
              <small>We'll text you a verification code</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>

            <div className="divider">or</div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <h2>Enter Verification Code</h2>
            <p className="step-description">We sent a code to {phoneNumber}</p>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="otp">6-Digit Code</label>
              <input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                className="otp-input"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="resend-container">
              <button
                type="button"
                className="btn btn-text"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </button>
              <button
                type="button"
                className="btn btn-text"
                onClick={handleBackToPhone}
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}

        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="auth-form">
            <h2>Create Your Profile</h2>
            <p className="step-description">Almost there! Tell us about yourself</p>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <small>No spaces or special characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                placeholder="Your Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
              <small>How you'll appear on the platform</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Complete Setup'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
