import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './GetInvolved.css';

const GetInvolved = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/getinvolved').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};

  // Remove 'Sponsor a child' and icons
  const ways = (c.ways || ['Volunteer with us', 'Participate in outreach programs', 'Support prayer missions', 'Join worship events'])
    .filter(w => w.toLowerCase() !== 'sponsor a child');

  return (
    <div className="getinvolved-page">
      <PageHero
        title={data?.title || 'Get Involved'}
        subtitle={data?.subtitle || 'Become part of our mission and help transform lives'}
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80"
        badge="GET INVOLVED"
      />
      <section className="involved-section">
        <div className="container">
          <h2 className="section-title">Ways to Help</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">There are many ways you can join our mission</p>
          <div className="ways-grid">
            {ways.map((w, i) => (
              <div className="way-card" key={i}>
                <h3>{w}</h3>
              </div>
            ))}
          </div>
          {(c.customBlocks || []).filter(Boolean).length > 0 && (
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
              {c.customBlocks.filter(Boolean).map((block, i) => (
                <p key={i} style={{ marginBottom: '16px' }}>{block}</p>
              ))}
            </div>
          )}
          <div className="join-banner">
            <div className="join-inner">
              <h2>Join Our Mission</h2>
              <p>{c.joinMessage || 'Together, we can bring hope and the love of Christ to communities everywhere.'}</p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/auth/helper/signup" className="btn-primary">Sign Up as Partner</Link>
                <Link to="/contact" className="btn-outline">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
