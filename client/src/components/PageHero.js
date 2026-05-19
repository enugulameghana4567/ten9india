import React from 'react';
import './PageHero.css';

const PageHero = ({ title, subtitle, image, badge }) => {
  return (
    <section className="page-hero" style={{ backgroundImage: `url(${image})` }}>
      <div className="page-hero-overlay"></div>
      <div className="page-hero-content">
        {badge && <div className="page-hero-badge">{badge}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHero;
