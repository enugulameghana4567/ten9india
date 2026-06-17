import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <div>
              <div className="footer-name">TEN9 Ministries India</div>
              <div className="footer-verse">Romans 10:9</div>
            </div>
          </div>
          <p className="footer-tagline">"Sharing the Love of Christ Across India"</p>
          <p className="footer-desc">A Christ-centered ministry dedicated to sharing hope, faith, and transformation through Jesus Christ.</p>
        </div>
        <div className="footer-links-col">
          <h4>Navigation</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/what-we-do">What We Do</Link>
          <Link to="/building-projects">Building Projects</Link>
          <Link to="/get-involved">Get Involved</Link>
        </div>
        <div className="footer-links-col">
          <h4>Ministry</h4>
          <Link to="/give">Give</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/auth">Sign In</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>ten9india@gmail.com</p>
          <p>TEN9 Ministries India</p>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p className="footer-verse-quote">"If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised Him from the dead, you will be saved." — Romans 10:9</p>
        <p className="footer-copy">© {new Date().getFullYear()} TEN9 Ministries India. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;