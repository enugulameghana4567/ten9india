import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './ChildCare.css';

const ChildCare = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/childcare').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};
  const provides = c.provides || ['Educational support', 'Food and nutrition', 'Emotional care', 'Prayer and spiritual guidance', 'Safe and loving environments'];

  return (
    <div className="childcare-page">
      <PageHero
        title={data?.title || 'Child Care Ministry'}
        subtitle={data?.subtitle || 'Protecting, supporting, and uplifting children'}
        image="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80"
        badge="Child Care"
      />
      <section className="childcare-main">
        <div className="container">
          <div className="childcare-grid">
            <div>
              <span className="section-label">Child Care Ministry</span>
              <h2>Every Child Deserves Love</h2>
              <div className="gold-bar"></div>
              <p className="childcare-desc">{c.description || 'Our child care ministry is focused on protecting, supporting, and uplifting children through love and compassion.'}</p>
              <div className="provides-grid">
                {provides.map((p, i) => (
                  <div className="provide-card" key={i}>
                    <span className="provide-icon">💛</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
              {c.purpose && (
                <div className="purpose-box">
                  <strong>Our Purpose:</strong> {c.purpose}
                </div>
              )}
            </div>
            <div className="childcare-images">
              <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80" alt="Children" className="cc-img-main" />
              <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&q=80" alt="Education" className="cc-img-sm" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChildCare;
