import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './Give.css';

const Give = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/give').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};
  const supports = c.supports || ['Child care programs', 'Community outreach', 'Building projects', 'Food distribution', 'Christmas missions'];
  const methods = c.methods || ['Bank Transfer', 'UPI', 'Online Donations'];

  return (
    <div className="give-page">
      <PageHero
        title={data?.title || 'Your Give'}
        subtitle={data?.subtitle || 'Your generous support helps us continue our mission'}
        image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1600&q=80"
        badge="Donations"
      />
      <section className="give-section">
        <div className="container">
          <div className="give-grid">
            <div className="give-info">
              <span className="section-label">Why Give</span>
              <h2>Your Gift Changes Lives</h2>
              <div className="gold-bar"></div>
              <p>{c.description || 'Your generous support helps us continue serving communities, supporting children, and spreading the Gospel.'}</p>
              <h3 className="supports-title">Your Contributions Support:</h3>
              <div className="supports-list">
                {supports.map((s, i) => (
                  <div className="support-item" key={i}>
                    <span>✓</span><span>{s}</span>
                  </div>
                ))}
              </div>
              {c.message && <div className="give-quote">"{c.message}"</div>}
            </div>
            <div className="give-methods">
              <h3>Donation Methods</h3>
              {methods.map((m, i) => (
                <div className="method-card" key={i}>
                  <div className="method-icon">{['🏦','📱','💻'][i]}</div>
                  <div>
                    <h4>{m}</h4>
                    <p>Contact us for {m.toLowerCase()} details</p>
                  </div>
                </div>
              ))}
              {c.bankDetails?.upi && (
                <div className="upi-box">
                  <strong>UPI ID:</strong> {c.bankDetails.upi}
                </div>
              )}
              <div className="give-contact-note">
                <p>📧 For donation queries: <strong>info@ten9ministries.in</strong></p>
                <p>📱 <strong>+91 00000 00000</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Give;
