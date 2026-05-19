import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './Supporters.css';

const Supporters = () => {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/public/supporters')
      .then(r => { setSupporters(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="supporters-page">
      <PageHero
        title="Our Supporters"
        subtitle="People who stand with TEN9 Ministries India through prayer, service, and generosity"
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80"
        badge="Supporters"
      />
      <section className="supporters-section">
        <div className="container">
          <h2 className="section-title">Those Who Stand With Us</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">We are grateful for every person who has joined our mission.</p>

          {loading ? (
            <div className="supporters-loading">
              <div className="loading-cross">✝</div>
              <p>Loading supporters...</p>
            </div>
          ) : supporters.length === 0 ? (
            <div className="supporters-empty">
              <span>🙏</span>
              <p>Supporter profiles coming soon. Be the first to join us!</p>
              <a href="/get-involved" className="btn-primary">Get Involved</a>
            </div>
          ) : (
            <div className="supporters-grid">
              {supporters.map(s => (
                <div key={s._id} className="supporter-card">
                  <div className="supporter-img-wrap">
                    <img
                      src={`/uploads/${s.image}`}
                      alt={s.name}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&q=80'; }}
                    />
                  </div>
                  <div className="supporter-info">
                    <h3>{s.name}</h3>
                    <span className="supporter-badge">✝ Supporter</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="supporters-cta">
            <h3>Want to Be a Supporter?</h3>
            <p>Join our community and be part of the mission to spread the love of Christ.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/give" className="btn-primary">Support Now 💛</a>
              <a href="/auth/helper/signup" className="btn-outline">Join as Helper</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Supporters;
