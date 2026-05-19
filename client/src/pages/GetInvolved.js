import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './GetInvolved.css';

const GetInvolved = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/getinvolved').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};
  const ways = c.ways || ['Volunteer with us', 'Participate in outreach programs', 'Sponsor a child', 'Support prayer missions', 'Join worship events'];
  const waysIcons = ['🙌', '🌍', '👶', '🙏', '🎵'];

  return (
    <div className="getinvolved-page">
      <PageHero
        title={data?.title || 'Get Involved'}
        subtitle={data?.subtitle || 'Become part of our mission and help transform lives'}
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80"
        badge="Get Involved"
      />
      <section className="involved-section">
        <div className="container">
          <h2 className="section-title">Ways to Help</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">There are many ways you can join our mission</p>
          <div className="ways-grid">
            {ways.map((w, i) => (
              <div className="way-card" key={i}>
                <div className="way-icon">{waysIcons[i] || '✝'}</div>
                <h3>{w}</h3>
              </div>
            ))}
          </div>
          <div className="join-banner">
            <div className="join-inner">
              <h2>Join Our Mission</h2>
              <p>{c.joinMessage || 'Together, we can bring hope and the love of Christ to communities everywhere.'}</p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/auth/helper/signup" className="btn-primary">Sign Up as Helper</Link>
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
