import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import './Dashboard.css';
import './DashboardExtra.css';

const MINISTRY_PAGES = [
  { key:'home', label:'Home', icon:'🏠', path:'/', desc:'Ministry homepage' },
  { key:'about', label:'About Us', icon:'📖', path:'/about', desc:'Our story & mission' },
  { key:'whatwedo', label:'What We Do', icon:'', path:'/what-we-do', desc:'Ministries & services' },
  { key:'building', label:'Building Projects', icon:'🏗️', path:'/building-projects', desc:'Current constructions' },
  { key:'christmas', label:'Project Christmas 2026', icon:'🎄', path:'/christmas-2026', desc:'Christmas mission' },
  { key:'childcare', label:'Child Care', icon:'👶', path:'/child-care', desc:'Child care ministry' },
  { key:'getinvolved', label:'Get Involved', icon:'🙌', path:'/get-involved', desc:'Ways to help' },
  { key:'give', label:'Your Give', icon:'💛', path:'/give', desc:'Donation information' },
  { key:'contact', label:'Contact Us', icon:'📧', path:'/contact', desc:'Get in touch' },
];

const HelperDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => { fetchUnreadCount(); }, []);
  useEffect(() => { if (activeTab==='announcements') fetchAnnouncements(); if (activeTab==='supporters') fetchSupporters(); }, [activeTab]);

  const fetchUnreadCount = async () => {
    try { const { data } = await API.get('/helpers/announcements/unread-count'); setUnreadCount(data.count); } catch {}
  };

  const fetchAnnouncements = async () => {
    try { const { data } = await API.get('/helpers/announcements'); setAnnouncements(data); setUnreadCount(0); } catch {}
  };

  const fetchSupporters = async () => {
    try { const { data } = await API.get('/helpers/partners'); setSupporters(data); } catch {}
  };

  const viewPage = async (pageKey) => {
    setSelectedPage(pageKey);
    setActiveTab('view');
    setLoadingPage(true);
    try { const { data } = await API.get(`/pages/${pageKey}`); setPageData(data); } catch {}
    setLoadingPage(false);
  };

  const renderPageContent = () => {
    if (loadingPage) return <div className="dash-loading">Loading content...</div>;
    if (!pageData) return null;
    const c = pageData.content||{};
    const pageInfo = MINISTRY_PAGES.find(p=>p.key===selectedPage);
    return (
      <div className="helper-page-view">
        <div className="helper-page-header">
          <button className="btn-back" onClick={()=>{setActiveTab('pages');setPageData(null);}}>← Back</button>
          <h3>{pageInfo?.icon} {pageData.title}</h3>
          <Link to={pageInfo?.path} className="btn-visit" target="_blank">Visit Page ↗</Link>
        </div>
        <div className="helper-page-content-display">
          {pageData.subtitle&&<div className="content-block"><label>Subtitle</label><p>{pageData.subtitle}</p></div>}
          {c.welcomeText&&<div className="content-block"><label>Welcome Text</label><p>{c.welcomeText}</p></div>}
          {c.description&&<div className="content-block"><label>Description</label><p>{c.description}</p></div>}
          {c.mission&&<div className="content-block"><label>Mission</label><p>{c.mission}</p></div>}
          {c.vision&&<div className="content-block"><label>Vision</label><p>{c.vision}</p></div>}
          {c.bibleVerse&&<div className="content-block verse"><label>Bible Verse</label><p>{c.bibleVerse}</p></div>}
          {c.goal&&<div className="content-block"><label>Goal</label><p>{c.goal}</p></div>}
          {c.purpose&&<div className="content-block"><label>Purpose</label><p>{c.purpose}</p></div>}
          {c.passions?.length>0&&<div className="content-block"><label>Passions</label><ul className="content-list">{c.passions.map((p,i)=><li key={i}>{p}</li>)}</ul></div>}
          {c.programs?.length>0&&<div className="content-block"><label>Featured Programs</label><ul className="content-list">{c.programs.map((p,i)=><li key={i}>• {p}</li>)}</ul></div>}
          {c.services?.length>0&&<div className="content-block"><label>Services</label>{c.services.map((s,i)=><div key={i} className="content-sub-item"><strong>{s.name}</strong><p>{s.description}</p></div>)}</div>}
          {c.projects?.length>0&&<div className="content-block"><label>Projects</label><ul className="content-list">{c.projects.map((p,i)=><li key={i}>🏗️ {p}</li>)}</ul></div>}
          {c.activities?.length>0&&<div className="content-block"><label>Activities</label><ul className="content-list">{c.activities.map((a,i)=><li key={i}>🎁 {a}</li>)}</ul></div>}
          {c.provides?.length>0&&<div className="content-block"><label>What We Provide</label><ul className="content-list">{c.provides.map((p,i)=><li key={i}>💛 {p}</li>)}</ul></div>}
          {c.ways?.length>0&&<div className="content-block"><label>Ways to Help</label><ul className="content-list">{c.ways.map((w,i)=><li key={i}>🙌 {w}</li>)}</ul></div>}
          {c.supports?.length>0&&<div className="content-block"><label>Your Contributions Support</label><ul className="content-list">{c.supports.map((s,i)=><li key={i}>✓ {s}</li>)}</ul></div>}
          {c.email&&<div className="content-block"><label>Contact Details</label><p>📧 {c.email}</p>{c.phone&&<p>📱 {c.phone}</p>}{c.address&&<p>📍 {c.address}</p>}</div>}
          {c.bankDetails?.upi&&<div className="content-block"><label>Donation Details</label><p>UPI: {c.bankDetails.upi}</p></div>}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div><div className="dash-ministry">TEN9 Partner</div><div className="dash-name">{user?.name}</div></div>
        </div>
        <nav className="dash-nav">
          <button className={activeTab==='overview'?'active':''} onClick={()=>setActiveTab('overview')}>📊 Overview</button>
          <button className={activeTab==='announcements'?'active':''} onClick={()=>setActiveTab('announcements')}>
            📢 Announcements {unreadCount>0&&<span className="badge">{unreadCount}</span>}
          </button>
          <button className={activeTab==='pages'||activeTab==='view'?'active':''} onClick={()=>setActiveTab('pages')}>📄 Ministry Pages</button>
          <button className={activeTab==='supporters'?'active':''} onClick={()=>setActiveTab('supporters')}>🌟 Supporters</button>
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}>👤 My Profile</button>
        </nav>
      </div>

      <div className="dash-main">
        <div className="dash-topbar">
          <h2>{{overview:'Partner Dashboard',announcements:'Announcements',pages:'Ministry Pages',view:'Page Content',supporters:'Supporters',profile:'My Profile'}[activeTab]||'Dashboard'}</h2>
          <div className="dash-user-info"><span>🤝 {user?.name}</span><span className="helper-badge">Helper</span></div>
        </div>

        <div className="dash-content">
          {activeTab==='overview' && (
            <div>
              <div className="helper-profile-card">
                <div className="helper-avatar">🤝</div>
                <div>
                  <h3>Welcome, {user?.name}!</h3>
                  <p>{user?.email} • {user?.city}, {user?.country}</p>
                  {unreadCount>0&&<div className="unread-alert">🔔 You have <strong>{unreadCount} new announcement{unreadCount>1?'s':''}</strong> from the ministry!</div>}
                </div>
              </div>
              <div className="overview-welcome">
                <h3>You're Part of the TEN9 Family</h3>
                <p>Stay connected with the ministry. Browse announcements, view page content, and see our supporters. You'll receive email notifications for new announcements.</p>
                <div className="quick-actions" style={{marginTop:'20px'}}>
                  <button className="btn-primary" onClick={()=>setActiveTab('announcements')}>📢 View Announcements {unreadCount>0&&`(${unreadCount} new)`}</button>
                  <button className="btn-outline" onClick={()=>setActiveTab('pages')}>📄 Browse Pages</button>
                  <Link to="/give" className="btn-outline">💛 Support Ministry</Link>
                </div>
              </div>
            </div>
          )}

          {activeTab==='announcements' && (
            <div>
              {announcements.length===0 ? (
                <div className="empty-state"><span>📢</span><p>No announcements yet. Check back soon!</p></div>
              ) : (
                <div className="helper-announcements">
                  {announcements.map(ann=>(
                    <div key={ann._id} className="helper-ann-card">
                      <div className="helper-ann-header">
                        <h3>{ann.title}</h3>
                        <span className="helper-ann-date">{new Date(ann.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
                      </div>
                      <p className="helper-ann-matter">{ann.matter}</p>
                      {ann.images?.length>0&&(
                        <div className="helper-ann-images">
                          {ann.images.map((img,i)=>(
                            <img key={i} src={`/uploads/${img}`} alt={`img-${i}`}
                              onError={e=>{e.target.style.display='none'}} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab==='pages' && (
            <div>
              <div className="section-header"><h3>Ministry Pages</h3><p style={{color:'var(--text-light)',fontSize:'0.95rem',marginTop:'6px'}}>Click any page to view its content.</p></div>
              <div className="ministry-pages-grid">
                {MINISTRY_PAGES.map(page=>(
                  <div key={page.key} className="ministry-page-card" onClick={()=>viewPage(page.key)}>
                    <span className="mp-icon">{page.icon}</span>
                    <h3>{page.label}</h3>
                    <p>{page.desc}</p>
                    <div style={{marginTop:'12px',color:'var(--crimson)',fontSize:'0.85rem',fontWeight:'600'}}>View Content →</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab==='view' && renderPageContent()}

          {activeTab==='supporters' && (
            <div>
              <div className="section-header"><h3>Ministry Partners ({supporters.length})</h3></div>
              {supporters.length===0 ? (
                <div className="empty-state"><span>🌟</span><p>No partners added yet.</p></div>
              ) : (
                <div className="helper-supporters-grid">
                  {supporters.map(s=>(
                    <div key={s._id} className="helper-sup-card">
                      <img src={`/uploads/${s.image}`} alt={s.name} onError={e=>{e.target.style.display='none';}} />
                      <div className="helper-sup-name">{s.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab==='profile' && (
            <div>
              <div className="helper-profile-card">
                <div className="helper-avatar">👤</div>
                <div style={{flex:1}}>
                  <h3>{user?.name}</h3>
                  <p style={{color:'var(--text-light)',marginBottom:'16px'}}>Ministry Partner</p>
                  <div className="helper-details-grid">
                    <div className="helper-detail-item"><label>Email</label><span>{user?.email}</span></div>
                    <div className="helper-detail-item"><label>Country</label><span>{user?.country||'—'}</span></div>
                    <div className="helper-detail-item"><label>City</label><span>{user?.city||'—'}</span></div>
                    <div className="helper-detail-item"><label>Contact</label><span>{user?.contact||'—'}</span></div>
                  </div>
                </div>
              </div>
              <div className="overview-welcome">
                <h3>Your Role in TEN9 Ministries</h3>
                <p>As a helper, you are a valued part of our community. Stay connected, view ministry updates, and be ready to serve. God bless you!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelperDashboard;