import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './Christmas.css';

const Christmas = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/christmas').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};
  const activities = c.activities || ['Christmas gifts for children', 'Food distribution', 'Worship celebrations', 'Community outreach', 'Winter clothing donations'];

  return (
    <div className="christmas-page">
      <PageHero
        title={data?.title || '🎄 Project Christmas 2026'}
        subtitle={data?.subtitle || 'Spreading joy and love of Christ during Christmas'}
        image="https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=1600&q=80"
        badge="Project Christmas 2026"
      />
      <section className="christmas-section">
        <div className="container">
          <div className="christmas-grid">
            <div className="christmas-content">
              <span className="section-label">Our Mission</span>
              <h2>Bringing Joy This Christmas</h2>
              <div className="gold-bar"></div>
              <p>{c.mission || 'To spread the joy and love of Christ during Christmas by supporting underprivileged children and families.'}</p>
              <div className="activities-list">
                <h3>Activities</h3>
                {activities.map((a, i) => (
                  <div className="activity-item" key={i}>
                    <span className="activity-icon">🎁</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="christmas-visual">
              <img src="https://images.unsplash.com/photo-1543946207-39bd91e70ca7?w=600&q=80" alt="Christmas Ministry" />
              <div className="goal-card">
                <div className="goal-star">⭐</div>
                <h3>Our Goal for 2026</h3>
                <p>{c.goal || 'To reach thousands of families with hope, prayer, and the message of Jesus Christ.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="christmas-cta">
        <div className="container">
          <h2>Be Part of the Christmas Mission</h2>
          <p>Your support can bring smiles to hundreds of children this Christmas.</p>
          <a href="/give" className="btn-primary">Support Now</a>
        </div>
      </section>
    </div>
  );
};

export default Christmas;
