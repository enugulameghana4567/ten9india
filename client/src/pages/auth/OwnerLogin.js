import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import './Auth.css';

const OwnerLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/owner/login', form);
      login(data.user, data.token);
      navigate('/dashboard/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-form-header">
          <span className="auth-form-cross">👑</span>
          <h2>Owner Login</h2>
          <p>Access the TEN9 Ministry dashboard</p>
        </div>
        {error && <div className="auth-error">⚠ {error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              name="email" type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="ten9india@gmail.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              name="password" type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : '✝ Login as Owner'}
          </button>
        </form>
        <div className="auth-footer-link" style={{ marginTop: '16px' }}>
          <Link to="/auth">← Back</Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
