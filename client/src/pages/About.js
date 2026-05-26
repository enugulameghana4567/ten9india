import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import './AboutPage.css';

const About = () => {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/pages/about').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};

  return (
    <div className="about-page">
      <PageHero
        title={data?.title || 'About TEN9 Ministries India'}
        subtitle={data?.subtitle || 'A Christ-centered ministry inspired by Epistle to the Romans 10:9'}
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80"
        badge="ABOUT US"
      />
      <section className="about-main">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-col">
              <img src="https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?w=600&q=80" alt="Ministry" className="about-img" />
              <div className="verse-card">
                <p>{c.bibleVerse || '"If you declare with your mouth, \'Jesus is Lord,\' and believe in your heart that God raised Him from the dead, you will be saved." — Romans 10:9'}</p>
              </div>
            </div>
            <div className="about-content">
              <span className="section-label">Our Story</span>
              <h2>Who We Are</h2>
              <div className="gold-bar"></div>
              <p className="about-desc">{c.description || 'TEN9 Ministries India is a Christ-centered ministry inspired by Epistle to the Romans 10:9, carrying the message of salvation, hope, and transformation through Jesus Christ.'}</p>
              <div className="mission-vision">
                <div className="mv-card">
                  <h3>OUR MISSION</h3>
                  <p>{c.mission || 'To proclaim Jesus Christ, inspire faith, and transform lives through the power of the Gospel.'}</p>
                </div>
                <div className="mv-card">
                  <h3>OUR VISION</h3>
                  <p>{c.vision || 'To see lives restored, hearts revived, and nations touched by the love of Christ.'}</p>
                </div>
              </div>
              {c.passions && (
                <div className="passions">
                  <h3>We Are Passionate About:</h3>
                  <ul>
                    {c.passions.map((p, i) => (
                      <li key={i}><span className="passion-check">✝</span>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;