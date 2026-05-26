import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',                  label: 'HOME' },
  { to: '/about',             label: 'ABOUT US' },
  { to: '/what-we-do',        label: 'WHAT WE DO' },
  { to: '/building-projects', label: 'BUILDING PROJECTS' },
  { to: '/get-involved',      label: 'GET INVOLVED' },
  { to: '/give',              label: 'GIVE' },
  { to: '/partners',          label: 'PARTNERS' },
  { to: '/contact',           label: 'CONTACT US' },
];

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { user, logout }          = useAuth();
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const menuRef                   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} ref={menuRef}>
      <div className="nav-container">

        {/* Brand with Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <img
            src="/logo.png"
            alt="TEN9 Ministries India"
            className="nav-logo-img"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
          <div className="nav-logo-fallback" style={{display:'none'}}>
            <span className="nav-cross">&#10013;</span>
            <div className="brand-text">
              <span className="brand-name">TEN9 Ministries</span>
              <span className="brand-sub">India</span>
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links-desktop">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="nav-auth-desktop">
          {user ? (
            <>
              <Link
                to={user.role === 'owner' ? '/dashboard/owner' : '/dashboard/helper'}
                className="nav-dashboard-link"
              >
                {user.role === 'owner' ? '👑' : '🤝'} Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-nav-logout">Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn-nav-signin">Sign In</Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="nav-drawer-inner">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-drawer-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="nav-drawer-divider"></div>
          {user ? (
            <>
              <Link
                to={user.role === 'owner' ? '/dashboard/owner' : '/dashboard/helper'}
                className="nav-drawer-link dashboard"
                onClick={() => setMenuOpen(false)}
              >
                {user.role === 'owner' ? '👑 Owner Dashboard' : '🤝 My Dashboard'}
              </Link>
              <button className="btn-drawer-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-drawer-signin" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;