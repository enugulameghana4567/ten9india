import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import './Home.css';

const programLinks = {
  'Gospel Outreach': '/what-we-do',
  'Community Help': '/what-we-do',
  'Building Projects': '/building-projects',
};

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/pages/home').then(r => setData(r.data)).catch(() => {});
  }, []);

  const programs = (data?.content?.programs || ['Gospel Outreach','Community Help','Building Projects'])
    .filter(p => p !== 'Child Care Support' && p !== 'Christmas 2026 Mission');

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?w=1600&q=80)` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">✝ Romans 10:9</div>
          <h1 className="hero-title">Sharing the Love of Christ Across India</h1>
          <p className="hero-sub">{data?.subtitle || 'TEN9 Ministries India is committed to spreading the Gospel, transforming lives, caring for children, and serving communities through faith, compassion, and action.'}</p>
          <div className="hero-buttons">
            <Link to="/get-involved" className="btn-hero-primary">Join the Mission</Link>
            <Link to="/about" className="btn-hero-ghost">Learn More</Link>
          </div>
        </div>
        <div className="hero-scroll-hint">↓ Scroll</div>
      </section>

      {/* Welcome */}
      <section className="welcome-section">
        <div className="container">
          <div className="welcome-grid">
            <div className="welcome-text">
              <span className="section-label">Welcome</span>
              <h2>{data?.content?.welcomeText || 'Welcome to TEN9 Ministries India — a Christ-centered ministry dedicated to sharing hope, faith, and transformation through Jesus Christ.'}</h2>
              <div className="gold-bar"></div>
              <p className="vision-text">
                <strong>Vision:</strong> {data?.content?.vision || 'To bring people closer to God and impact lives through love, prayer, worship, and service.'}
              </p>
            </div>
            <div className="welcome-image">
              <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80" alt="Ministry" />
              <div className="img-badge">
                <span>Est.</span>
                <span className="year">2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="programs-section">
        <div className="container">
          <h2 className="section-title">Featured Programs</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">Serving communities through faith, compassion, and action</p>
          <div className="programs-grid">
            {programs.map(p => (
              <Link to={programLinks[p] || '/'} key={p} className="program-card">
                <h3>{p}</h3>
                <span className="program-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-num">1000+</div><div className="stat-label">Lives Touched</div></div>
            <div className="stat-item"><div className="stat-num">20+</div><div className="stat-label">Outreach Events</div></div>
            <div className="stat-item"><div className="stat-num">300+</div><div className="stat-label">Children Supported</div></div>
            <div className="stat-item"><div className="stat-num">10+</div><div className="stat-label">Communities Served</div></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-cross">✝</div>
          <h2>Be a Part of the Mission</h2>
          <p>Your support, prayers, and involvement make a difference in the lives of countless families and children.</p>
          <div className="cta-buttons">
            <Link to="/give" className="btn-primary">Give</Link>
            <Link to="/get-involved" className="btn-outline">Get Involved</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;