import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './WhatWeDo.css';
const WhatWeDo = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/whatwedo').then(r => setData(r.data)).catch(() => {}); }, []);
  const services = (data?.content?.services || [
    { name: 'Gospel Outreach', description: 'Sharing the Word of God through evangelism, prayer meetings, worship gatherings, and mission programs.' },
    { name: 'Community Support', description: 'Helping families and communities through food distribution, education support, and emergency assistance.' },
    { name: 'Prayer & Worship', description: 'Conducting worship events, spiritual counseling, and prayer support for individuals and families.' },
    { name: 'Youth Ministry', description: 'Encouraging young people to grow spiritually and become future leaders rooted in faith.' }
  ]).filter(s => s.name !== 'Child Care Mission');
  return (
    <div className="whatwedo-page">
      <PageHero
        title={data?.title || 'Our Ministries & Services'}
        subtitle={data?.subtitle || 'Serving communities through faith and action'}
        image="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80"
        badge="What We Do"
      />
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">How We Serve</h2>
          <div className="gold-divider"></div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card" key={i}>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {(data?.content?.customBlocks || []).filter(Boolean).length > 0 && (
        <section className="services-section">
          <div className="container">
            {data.content.customBlocks.filter(Boolean).map((block, i) => (
              <p key={i} style={{ marginBottom: '16px' }}>{block}</p>
            ))}
          </div>
        </section>
      )}
      <section className="impact-banner">
        <div className="container">
          <div className="impact-content">
            <h2>Transforming Lives Through Faith</h2>
            <p>Every program, every outreach, every prayer is a step closer to fulfilling God's calling to love and serve.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" alt="Impact" className="impact-img" />
        </div>
      </section>
    </div>
  ); 
};
export default WhatWeDo;
