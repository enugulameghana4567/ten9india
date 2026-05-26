import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import './Auth.css';

const HelperLogin = () => {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) { setError('Please enter your email address'); return; }
    if (!emailRegex.test(email.trim())) { setError('Please enter a valid email address'); return; }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/helper/login', { email: email.trim() });
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard/helper');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">

        <div className="auth-form-header">
          <span className="auth-form-cross">🤝</span>
          <h2>Partner Login</h2>
          <p>Welcome back to TEN9 Ministries India</p>
        </div>

        {error && <div className="auth-error">&#9888; {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>

          <div className="otp-notice" style={{ marginTop: '4px' }}>
            Enter your registered email address to access your dashboard.
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer-link">
          Not registered? <Link to="/auth/helper/signup">Register as Partner</Link>
        </div>
        <div className="auth-footer-link" style={{ marginTop: '8px' }}>
          <Link to="/auth">&#8592; Back to Auth Options</Link>
        </div>

      </div>
    </div>
  );
};

export default HelperLogin;