import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import './Auth.css';

const HelperSignup = () => {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({
    name: '', country: '', city: '', email: '', contact: '', password: '', confirm: ''
  });
  const [otp, setOtp]         = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOTP = async e => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.country || !form.city || !form.email || !form.contact || !form.password || !form.confirm) {
      setError('All fields are required'); return;
    }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      await API.post('/auth/helper/send-otp', {
        name: form.name, country: form.country, city: form.city,
        email: form.email, contact: form.contact, password: form.password
      });
      toast.success('OTP sent! Check your inbox (and spam folder).');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOTP = async e => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length !== 6) { setError('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/helper/verify-otp', { email: form.email, otp });
      login(data.user, data.token);
      toast.success('Welcome to TEN9 Ministries! Check your email for a welcome message.');
      navigate('/dashboard/helper');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container" style={{ maxWidth: '560px' }}>

        <div className="auth-form-header">
          <h2>{step === 1 ? 'Join as Partner' : 'Verify Your Email'}</h2>
          <p>
            {step === 1
              ? 'Register as a Partner of TEN9 Ministries India'
              : `Enter the 6-digit code sent to ${form.email}`}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="otp-steps">
          <div className={`otp-step ${step >= 1 ? 'active' : ''}`}><span>1</span> Fill Details</div>
          <div className="otp-step-line"></div>
          <div className={`otp-step ${step >= 2 ? 'active' : ''}`}><span>2</span> Verify OTP</div>
        </div>

        {error && <div className="auth-error">&#9888; {error}</div>}

        {/* ── STEP 1 FORM ─────────────────────────────────────────────────── */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendOTP}>
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label>Country *</label>
                <input name="country" value={form.country} onChange={handleChange} placeholder="e.g. India" required />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Hyderabad" required />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input name="contact" value={form.contact} onChange={handleChange} placeholder="+91 00000 00000" required />
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label>Password * (min 6 chars)</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Confirm" required />
              </div>
            </div>

            <div className="otp-notice">
              A 6-digit verification code will be sent to your email address.
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* ── STEP 2 OTP ──────────────────────────────────────────────────── */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleVerifyOTP}>

            {/* Email sent confirmation */}
            <div className="otp-info-box">
              <div className="otp-info-icon">&#9993;</div>
              <p>Verification code sent to <strong>{form.email}</strong></p>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-light)', marginTop: '4px' }}>
                Valid for 10 minutes.
              </p>
            </div>

            {/* SPAM WARNING — key fix for inbox delivery */}
            <div className="spam-warning-box">
              <div className="spam-warning-icon">&#128276;</div>
              <div>
                <strong>Email not in inbox?</strong>
                <p>
                  Check your <strong>Spam</strong> or <strong>Junk</strong> folder.
                  If found there, open it and click <strong>"Not Spam"</strong> or
                  <strong> "Mark as not junk"</strong> — this moves it to your inbox
                  and ensures all future TEN9 emails arrive in your Primary inbox.
                </p>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Enter 6-Digit Code *</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="otp-input"
                autoFocus
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify and Complete Registration'}
            </button>

            <button
              type="button"
              className="btn-resend"
              onClick={() => { setStep(1); setOtp(''); setError(''); }}
            >
              &#8592; Change Details / Resend Code
            </button>
          </form>
        )}

        <div className="auth-footer-link">
          Already registered? <Link to="/auth/helper/login">Login here</Link>
        </div>
        <div className="auth-footer-link" style={{ marginTop: '8px' }}>
          <Link to="/auth">&#8592; Back to Auth Options</Link>
        </div>
      </div>
    </div>
  );
};

export default HelperSignup;