import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const AuthLanding = () => {
  return (
    <div className="auth-landing">
      <div className="auth-hero">
        <div className="auth-hero-overlay"></div>
        <div className="auth-hero-content">
          <h1>TEN9 Ministries Portal</h1>
          <p>Sign in to access the ministry portal</p>
        </div>
      </div>
      <div className="auth-cards-section">
        <div className="container auth-cards-grid">
          <div className="auth-type-card">
            <div className="auth-type-icon">👑</div>
            <h2>Ministry Owner</h2>
            <p>Access the owner dashboard to manage pages, view partners, and post announcements.</p>
            <div className="auth-type-buttons">
              <Link to="/auth/owner/login" className="btn-primary">Login as Owner</Link>
            </div>
          </div>
          <div className="auth-divider"><span>OR</span></div>
          <div className="auth-type-card">
            <div className="auth-type-icon">🤝</div>
            <h2>Ministry Partner</h2>
            <p>Register or sign in to stay connected and receive ministry updates and announcements.</p>
            <div className="auth-type-buttons">
              <Link to="/auth/helper/login" className="btn-primary">Login as Partner</Link>
              <Link to="/auth/helper/signup" className="btn-outline">Register as Partner</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;