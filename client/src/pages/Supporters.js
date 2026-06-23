import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './Supporters.css';

const Partners = () => {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenIds, setBrokenIds] = useState({});
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    API.get('/public/supporters')
      .then(r => { setSupporters(r.data); setLoading(false); })
      .catch(() => setLoading(false));
    API.get('/pages/partners').then(r => setPageData(r.data)).catch(() => {});
  }, []);

  const markBroken = (id) => setBrokenIds(prev => ({ ...prev, [id]: true }));

  const visibleSupporters = supporters.filter(s => s.image && !brokenIds[s._id]);
  const customBlocks = (pageData?.content?.customBlocks || []).filter(Boolean);

  return (
    <div className="supporters-page">
      <PageHero
        title={pageData?.title || "Our Partners"}
        subtitle={pageData?.subtitle || "People who stand with TEN9 Ministries India through prayer, service, and generosity"}
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80"
        badge="PARTNERS"
      />
      <section className="supporters-section">
        <div className="container">
          <h2 className="section-title">Those Who Stand With Us</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">We are grateful for every person who has joined our mission.</p>

          {loading ? (
            <div className="supporters-loading">
              <p>Loading partners...</p>
            </div>
          ) : visibleSupporters.length === 0 ? (
            <div className="supporters-empty">
              <p>Partner profiles coming soon. Be the first to join us!</p>
              <a href="/get-involved" className="btn-primary">Get Involved</a>
            </div>
          ) : (
            <div className="supporters-grid">
              {visibleSupporters.map(s => (
                <div key={s._id} className="supporter-card">
                  <div className="supporter-img-wrap">
                    <img
                      src={`/uploads/${s.image}`}
                      alt={s.name}
                      onError={() => markBroken(s._id)}
                    />
                  </div>
                  <div className="supporter-info">
                    <h3>{s.name}</h3>
                    <span className="supporter-badge">Partner</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {customBlocks.length > 0 && (
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
              {customBlocks.map((block, i) => (
                <p key={i} style={{ marginBottom: '16px' }}>{block}</p>
              ))}
            </div>
          )}

          <div className="supporters-cta">
            <h3>Want to Be a Partner?</h3>
            <p>Join our community and be part of the mission to spread the love of Christ.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/give" className="btn-primary">Support Now</a>
              <a href="/auth/helper/signup" className="btn-outline">Join as Partner</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
