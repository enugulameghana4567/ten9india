import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './Building.css';

const Building = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/building').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};
  const projects = c.projects || ['Prayer Hall Construction', 'Community Worship Center', "Children's Care Facility", 'Educational Support Center'];

  return (
    <div className="building-page">
      <PageHero
        title={data?.title || 'Building Projects'}
        subtitle={data?.subtitle || 'Creating spaces that bring hope and transformation'}
        image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
        badge="Building Projects"
      />
      <section className="building-section">
        <div className="container">
          <h2 className="section-title">Current Projects</h2>
          <div className="gold-divider"></div>
          <p className="section-subtitle">{c.description || 'TEN9 Ministries India is committed to building spaces that bring hope and transformation to communities.'}</p>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div className="project-card" key={i}>
                <div className="project-num">0{i + 1}</div>
                <div className="project-icon">🏗️</div>
                <h3>{p}</h3>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${[65, 40, 80, 25][i]}%` }}></div>
                  </div>
                  <span>{[65, 40, 80, 25][i]}% Complete</span>
                </div>
              </div>
            ))}
          </div>
          {c.goal && (
            <div className="goal-banner">
              <span className="goal-icon">🎯</span>
              <div>
                <strong>Our Goal:</strong>
                <p>{c.goal}</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="building-gallery">
        <div className="container">
          <div className="gallery-grid">
            <img src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&q=80" alt="Construction" />
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" alt="Building" />
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80" alt="Community" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Building;
