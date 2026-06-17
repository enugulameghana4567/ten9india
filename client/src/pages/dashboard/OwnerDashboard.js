import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const PAGES = [
  { key: 'home', label: '🏠 Home' },
  { key: 'about', label: '📖 About Us' },
  { key: 'whatwedo', label: 'What We Do' },
  { key: 'building', label: '🏗️ Building Projects' },
  { key: 'christmas', label: '🎄 Christmas 2026' },
  { key: 'childcare', label: '👶 Child Care' },
  { key: 'getinvolved', label: '🙌 Get Involved' },
  { key: 'give', label: '💛 Your Give' },
  { key: 'contact', label: '📧 Contact Us' },
];

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activePage, setActivePage] = useState('home');
  const [pageData, setPageData] = useState({ title: '', subtitle: '', content: {} });
  const [helpers, setHelpers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [brokenSupIds, setBrokenSupIds] = useState({});

  // Announcement form
  const [annForm, setAnnForm] = useState({ title: '', matter: '' });
  const [annImages, setAnnImages] = useState([]);
  const [annImagePreviews, setAnnImagePreviews] = useState([]);
  const [annSubmitting, setAnnSubmitting] = useState(false);
  const annFileRef = useRef();

  // Supporter form
  const [supForm, setSupForm] = useState({ name: '' });
  const [supImage, setSupImage] = useState(null);
  const [supImagePreview, setSupImagePreview] = useState(null);
  const [supSubmitting, setSupSubmitting] = useState(false);
  const supFileRef = useRef();

  // Payment
  const [payHelperId, setPayHelperId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [paySending, setPaySending] = useState(false);

  const counts = {
    helpers: helpers.length,
    unreadContacts: contacts.filter(c => !c.read).length,
    announcements: announcements.length,
    supporters: supporters.length
  };

  useEffect(() => {
    fetchHelpers(); fetchContacts(); fetchAnnouncements(); fetchSupporters();
  }, []);

  useEffect(() => { if (activeTab === 'pages') fetchPageData(activePage); }, [activePage, activeTab]);

  const fetchHelpers = async () => { try { const { data } = await API.get('/owner/helpers'); setHelpers(data); } catch {} };
  const fetchContacts = async () => { try { const { data } = await API.get('/contact'); setContacts(data); } catch {} };
  const fetchAnnouncements = async () => { try { const { data } = await API.get('/owner/announcements'); setAnnouncements(data); } catch {} };
  const fetchSupporters = async () => { try { const { data } = await API.get('/owner/supporters'); setSupporters(data); } catch {} };

  const fetchPageData = async (page) => {
    setLoadingPage(true);
    try { const { data } = await API.get(`/pages/${page}`); setPageData({ title: data.title || '', subtitle: data.subtitle || '', content: data.content || {} }); } catch {}
    setLoadingPage(false);
  };

  const savePage = async () => {
    setSaving(true);
    try { await API.put(`/pages/${activePage}`, pageData); toast.success('Page updated!'); } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const markRead = async (id) => {
    try { await API.put(`/contact/${id}/read`); setContacts(contacts.map(c => c._id === id ? { ...c, read: true } : c)); } catch {}
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try { await API.delete(`/contact/${id}`); setContacts(contacts.filter(c => c._id !== id)); toast.success('Message deleted'); }
    catch { toast.error('Failed to delete message'); }
  };

  const updateContent = (key, value) => setPageData(prev => ({ ...prev, content: { ...prev.content, [key]: value } }));

  // Announcement image picker
  const handleAnnImages = (e) => {
    const files = Array.from(e.target.files);
    setAnnImages(files);
    setAnnImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const submitAnnouncement = async (e) => {
    e.preventDefault();
    if (!annForm.title || !annForm.matter) { toast.error('Title and matter are required'); return; }
    setAnnSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', annForm.title);
      fd.append('matter', annForm.matter);
      annImages.forEach(img => fd.append('images', img));
      await API.post('/owner/announcements', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Announcement posted! All helpers notified by email. 📢');
      setAnnForm({ title: '', matter: '' });
      setAnnImages([]); setAnnImagePreviews([]);
      if (annFileRef.current) annFileRef.current.value = '';
      fetchAnnouncements();
    } catch { toast.error('Failed to post announcement'); }
    setAnnSubmitting(false);
  };

  const deleteAnnouncement = async (id) => {
    try { await API.delete(`/owner/announcements/${id}`); toast.success('Deleted'); fetchAnnouncements(); } catch {}
  };

  // Supporter image picker
  const handleSupImage = (e) => {
    const f = e.target.files[0];
    if (f) { setSupImage(f); setSupImagePreview(URL.createObjectURL(f)); }
  };

  const submitSupporter = async (e) => {
    e.preventDefault();
    if (!supForm.name || !supImage) { toast.error('Name and image are required'); return; }
    setSupSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', supForm.name);
      fd.append('image', supImage);
      await API.post('/owner/supporters', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Partner added!');
      setSupForm({ name: '' }); setSupImage(null); setSupImagePreview(null);
      if (supFileRef.current) supFileRef.current.value = '';
      fetchSupporters();
    } catch { toast.error('Failed to add supporter'); }
    setSupSubmitting(false);
  };

  const deleteSupporter = async (id) => {
    try { await API.delete(`/owner/supporters/${id}`); toast.success('Deleted'); fetchSupporters(); } catch {}
  };

  const deleteHelper = async (id) => {
    if (!window.confirm('Remove this registered partner? This cannot be undone.')) return;
    try { await API.delete(`/owner/helpers/${id}`); toast.success('Partner removed'); fetchHelpers(); }
    catch { toast.error('Failed to remove partner'); }
  };

  const sendPaymentEmail = async () => {
    if (!payHelperId) { toast.error('Select a helper'); return; }
    setPaySending(true);
    try { await API.post('/owner/payment-confirm', { helperId: payHelperId, amount: payAmount }); toast.success('Payment thank-you email sent! 💛'); setPayHelperId(''); setPayAmount(''); } catch { toast.error('Failed to send email'); }
    setPaySending(false);
  };

  const renderPageEditor = () => {
    if (loadingPage) return <div className="dash-loading">Loading page data...</div>;
    const c = pageData.content;
    return (
      <div className="page-editor">
        <div className="editor-header">
          <h3>{PAGES.find(p => p.key === activePage)?.label} — Page Editor</h3>
          <button className="btn-save" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
        </div>
        <div className="editor-section">
          <h4>Page Header</h4>
          <div className="form-group"><label>Page Title</label><input value={pageData.title} onChange={e => setPageData({ ...pageData, title: e.target.value })} /></div>
          <div className="form-group"><label>Page Subtitle</label><input value={pageData.subtitle} onChange={e => setPageData({ ...pageData, subtitle: e.target.value })} /></div>
        </div>
        {activePage === 'home' && <div className="editor-section"><h4>Home Content</h4>
          <div className="form-group"><label>Welcome Text</label><textarea rows="3" value={c.welcomeText||''} onChange={e => updateContent('welcomeText', e.target.value)} /></div>
          <div className="form-group"><label>Vision Statement</label><textarea rows="2" value={c.vision||''} onChange={e => updateContent('vision', e.target.value)} /></div>
          <div className="form-group"><label>Featured Programs (comma-separated)</label><input value={(c.programs||[]).join(', ')} onChange={e => updateContent('programs', e.target.value.split(',').map(s=>s.trim()))} /></div>
        </div>}
        {activePage === 'about' && <div className="editor-section"><h4>About Content</h4>
          <div className="form-group"><label>Description</label><textarea rows="4" value={c.description||''} onChange={e => updateContent('description', e.target.value)} /></div>
          <div className="form-group"><label>Mission</label><textarea rows="2" value={c.mission||''} onChange={e => updateContent('mission', e.target.value)} /></div>
          <div className="form-group"><label>Vision</label><textarea rows="2" value={c.vision||''} onChange={e => updateContent('vision', e.target.value)} /></div>
          <div className="form-group"><label>Bible Verse</label><textarea rows="2" value={c.bibleVerse||''} onChange={e => updateContent('bibleVerse', e.target.value)} /></div>
          <div className="form-group"><label>Passions (one per line)</label><textarea rows="4" value={(c.passions||[]).join('\n')} onChange={e => updateContent('passions', e.target.value.split('\n').filter(Boolean))} /></div>
        </div>}
        {activePage === 'whatwedo' && <div className="editor-section"><h4>Services</h4>
          {(c.services||[]).map((svc,i)=>(
            <div key={i} className="array-item">
              <div className="form-group"><label>Service {i+1} Name</label><input value={svc.name} onChange={e=>{const u=[...(c.services||[])];u[i]={...u[i],name:e.target.value};updateContent('services',u);}} /></div>
              <div className="form-group"><label>Description</label><textarea rows="2" value={svc.description} onChange={e=>{const u=[...(c.services||[])];u[i]={...u[i],description:e.target.value};updateContent('services',u);}} /></div>
            </div>))}
        </div>}
        {activePage === 'building' && <div className="editor-section"><h4>Building Projects</h4>
          <div className="form-group"><label>Description</label><textarea rows="3" value={c.description||''} onChange={e => updateContent('description', e.target.value)} /></div>
          <div className="form-group"><label>Projects (one per line)</label><textarea rows="4" value={(c.projects||[]).join('\n')} onChange={e => updateContent('projects', e.target.value.split('\n').filter(Boolean))} /></div>
          <div className="form-group"><label>Goal</label><textarea rows="2" value={c.goal||''} onChange={e => updateContent('goal', e.target.value)} /></div>
        </div>}
        {activePage === 'christmas' && <div className="editor-section"><h4>Christmas 2026 Mission</h4>
          <div className="form-group"><label>Mission Statement</label><textarea rows="3" value={c.mission||''} onChange={e => updateContent('mission', e.target.value)} /></div>
          <div className="form-group"><label>Activities (one per line)</label><textarea rows="5" value={(c.activities||[]).join('\n')} onChange={e => updateContent('activities', e.target.value.split('\n').filter(Boolean))} /></div>
          <div className="form-group"><label>Our Goal for 2026</label><textarea rows="2" value={c.goal||''} onChange={e => updateContent('goal', e.target.value)} /></div>
        </div>}
        {activePage === 'childcare' && <div className="editor-section"><h4>Child Care</h4>
          <div className="form-group"><label>Description</label><textarea rows="3" value={c.description||''} onChange={e => updateContent('description', e.target.value)} /></div>
          <div className="form-group"><label>What We Provide (one per line)</label><textarea rows="5" value={(c.provides||[]).join('\n')} onChange={e => updateContent('provides', e.target.value.split('\n').filter(Boolean))} /></div>
          <div className="form-group"><label>Purpose</label><textarea rows="2" value={c.purpose||''} onChange={e => updateContent('purpose', e.target.value)} /></div>
        </div>}
        {activePage === 'getinvolved' && <div className="editor-section"><h4>Get Involved</h4>
          <div className="form-group"><label>Ways to Help (one per line)</label><textarea rows="5" value={(c.ways||[]).join('\n')} onChange={e => updateContent('ways', e.target.value.split('\n').filter(Boolean))} /></div>
          <div className="form-group"><label>Join Message</label><textarea rows="2" value={c.joinMessage||''} onChange={e => updateContent('joinMessage', e.target.value)} /></div>
        </div>}
        {activePage === 'give' && <div className="editor-section"><h4>Donations Page</h4>
          <div className="form-group"><label>Description</label><textarea rows="3" value={c.description||''} onChange={e => updateContent('description', e.target.value)} /></div>
          <div className="form-group"><label>Support Items (one per line)</label><textarea rows="5" value={(c.supports||[]).join('\n')} onChange={e => updateContent('supports', e.target.value.split('\n').filter(Boolean))} /></div>
          <div className="form-group"><label>Donation Quote</label><input value={c.message||''} onChange={e => updateContent('message', e.target.value)} /></div>
          <div className="form-group"><label>UPI ID</label><input value={c.bankDetails?.upi||''} onChange={e => updateContent('bankDetails',{...(c.bankDetails||{}),upi:e.target.value})} placeholder="yourname@upi" /></div>
          <div className="form-group"><label>Bank Name</label><input value={c.bankDetails?.bankName||''} onChange={e => updateContent('bankDetails',{...(c.bankDetails||{}),bankName:e.target.value})} /></div>
          <div className="form-group"><label>Account Number</label><input value={c.bankDetails?.accountNumber||''} onChange={e => updateContent('bankDetails',{...(c.bankDetails||{}),accountNumber:e.target.value})} /></div>
          <div className="form-group"><label>IFSC Code</label><input value={c.bankDetails?.ifsc||''} onChange={e => updateContent('bankDetails',{...(c.bankDetails||{}),ifsc:e.target.value})} /></div>
        </div>}
        {activePage === 'contact' && <div className="editor-section"><h4>Contact Information</h4>
          <div className="form-group"><label>Email</label><input value={c.email||''} onChange={e => updateContent('email', e.target.value)} /></div>
          <div className="form-group"><label>Phone</label><input value={c.phone||''} onChange={e => updateContent('phone', e.target.value)} /></div>
          <div className="form-group"><label>Address</label><textarea rows="2" value={c.address||''} onChange={e => updateContent('address', e.target.value)} /></div>
          <div className="form-group"><label>Closing Message</label><textarea rows="2" value={c.closingMessage||''} onChange={e => updateContent('closingMessage', e.target.value)} /></div>
        </div>}
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div><div className="dash-ministry">TEN9 Owner</div><div className="dash-name">{user?.name}</div></div>
        </div>
        <nav className="dash-nav">
          <button className={activeTab==='overview'?'active':''} onClick={()=>setActiveTab('overview')}>📊 Overview</button>
          <button className={activeTab==='pages'?'active':''} onClick={()=>setActiveTab('pages')}>📝 Manage Pages</button>
          <button className={activeTab==='announce'?'active':''} onClick={()=>setActiveTab('announce')}>📢 Announcements</button>
          <button className={activeTab==='supporters'?'active':''} onClick={()=>setActiveTab('supporters')}>🌟 Partners</button>
          <button className={activeTab==='helpers'?'active':''} onClick={()=>setActiveTab('helpers')}>🤝 Partners ({counts.helpers})</button>
          <button className={activeTab==='messages'?'active':''} onClick={()=>{setActiveTab('messages');fetchContacts();}}>
            ✉ Messages {counts.unreadContacts>0&&<span className="badge">{counts.unreadContacts}</span>}
          </button>
          <button className={activeTab==='payment'?'active':''} onClick={()=>setActiveTab('payment')}>💛 Payment Confirm</button>
        </nav>
      </div>

      <div className="dash-main">
        <div className="dash-topbar">
          <h2>{['overview','pages','announce','supporters','helpers','messages','payment'].includes(activeTab) && {overview:'Dashboard Overview',pages:'Manage Pages',announce:'Announcements',supporters:'Supporters',helpers:'Registered Partners',messages:'Contact Messages',payment:'Payment Confirmation'}[activeTab]}</h2>
          <div className="dash-user-info"><span>👑 {user?.name}</span><span className="owner-badge">Owner</span></div>
        </div>

        <div className="dash-content">
          {/* OVERVIEW */}
          {activeTab==='overview' && (
            <div>
              <div className="stat-cards">
                <div className="stat-card"><div className="stat-card-icon">🤝</div><div className="stat-card-num">{counts.helpers}</div><div className="stat-card-label">Helpers</div></div>
                <div className="stat-card"><div className="stat-card-icon">📢</div><div className="stat-card-num">{counts.announcements}</div><div className="stat-card-label">Announcements</div></div>
                <div className="stat-card"><div className="stat-card-icon">🌟</div><div className="stat-card-num">{counts.supporters}</div><div className="stat-card-label">Supporters</div></div>
                <div className="stat-card"><div className="stat-card-icon">📬</div><div className="stat-card-num">{counts.unreadContacts}</div><div className="stat-card-label">Unread Messages</div></div>
              </div>
              <div className="overview-welcome">
                <h3>Welcome back!</h3>
                <p>You have full control over all ministry pages. Post announcements to notify all helpers, add supporters, and manage everything from here.</p>
                <div className="quick-actions">
                  <button className="btn-primary" onClick={()=>setActiveTab('announce')}>📢 Post Announcement</button>
                  <button className="btn-outline" onClick={()=>setActiveTab('pages')}>📝 Edit Pages</button>
                  <button className="btn-outline" onClick={()=>setActiveTab('supporters')}>🌟 Add Supporter</button>
                </div>
              </div>
            </div>
          )}

          {/* PAGES */}
          {activeTab==='pages' && (
            <div className="pages-editor-layout">
              <div className="pages-sidebar">
                <h4>Pages</h4>
                {PAGES.map(p=>(
                  <button key={p.key} className={`page-nav-btn ${activePage===p.key?'active':''}`} onClick={()=>setActivePage(p.key)}>{p.label}</button>
                ))}
              </div>
              <div className="pages-editor-area">{renderPageEditor()}</div>
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab==='announce' && (
            <div>
              <div className="announce-form-card">
                <h3>📢 Post New Announcement</h3>
                <p className="announce-note">All registered helpers will be notified by email automatically.</p>
                <form onSubmit={submitAnnouncement}>
                  <div className="form-group">
                    <label>Announcement Title *</label>
                    <input value={annForm.title} onChange={e=>setAnnForm({...annForm,title:e.target.value})} placeholder="e.g. Christmas Event 2026" required />
                  </div>
                  <div className="form-group">
                    <label>Announcement Matter *</label>
                    <textarea rows="5" value={annForm.matter} onChange={e=>setAnnForm({...annForm,matter:e.target.value})} placeholder="Write the full announcement content here..." required />
                  </div>
                  <div className="form-group">
                    <label>Images (optional, up to 5)</label>
                    <div className="image-upload-area" onClick={()=>annFileRef.current.click()}>
                      <input ref={annFileRef} type="file" multiple accept="image/*" onChange={handleAnnImages} style={{display:'none'}} />
                      {annImagePreviews.length===0 ? (
                        <div className="upload-placeholder"><span>🖼</span><p>Click to add images</p></div>
                      ) : (
                        <div className="image-preview-row">
                          {annImagePreviews.map((src,i)=><img key={i} src={src} alt={`preview-${i}`} />)}
                          <div className="add-more-img">+ Add More</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="btn-save" disabled={annSubmitting} style={{padding:'12px 28px'}}>
                    {annSubmitting ? 'Posting...' : '📢 Post & Notify All Helpers'}
                  </button>
                </form>
              </div>

              <div className="announce-list">
                <h3>Previous Announcements ({announcements.length})</h3>
                {announcements.length===0 ? (
                  <div className="empty-state"><span>📢</span><p>No announcements yet.</p></div>
                ) : announcements.map(ann=>(
                  <div key={ann._id} className="announce-card">
                    <div className="announce-card-header">
                      <div>
                        <h4>{ann.title}</h4>
                        <span className="announce-date">{ann.createdAt ? new Date(ann.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : 'N/A'}</span>
                        <span className="announce-read-count">👁 {ann.readBy?.length||0} helpers read</span>
                      </div>
                      <button className="btn-delete" onClick={()=>deleteAnnouncement(ann._id)}>🗑 Delete</button>
                    </div>
                    <p className="announce-matter">{ann.matter}</p>
                    {ann.images?.length>0 && (
                      <div className="announce-images">
                        {ann.images.map((img,i)=>(
                          <img key={i} src={`/uploads/${img}`} alt={`ann-${i}`}
                            onError={e=>{e.target.style.display='none'}} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPPORTERS */}
          {activeTab==='supporters' && (
            <div>
              <div className="announce-form-card">
                <h3>🌟 Add New Partner</h3>
                <form onSubmit={submitSupporter}>
                  <div className="form-group">
                    <label>Partner Name *</label>
                    <input value={supForm.name} onChange={e=>setSupForm({name:e.target.value})} placeholder="Full name" required />
                  </div>
                  <div className="form-group">
                    <label>Partner Photo *</label>
                    <div className="image-upload-area single" onClick={()=>supFileRef.current.click()}>
                      <input ref={supFileRef} type="file" accept="image/*" onChange={handleSupImage} style={{display:'none'}} />
                      {supImagePreview ? (
                        <img src={supImagePreview} alt="preview" className="sup-preview" />
                      ) : (
                        <div className="upload-placeholder"><span>👤</span><p>Click to upload photo</p></div>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="btn-save" disabled={supSubmitting} style={{padding:'12px 28px'}}>
                    {supSubmitting ? 'Adding...' : 'Add Partner'}
                  </button>
                </form>
              </div>

              <div className="supporters-owner-grid">
                {supporters.length===0 ? (
                  <div className="empty-state"><span>🌟</span><p>No partners added yet.</p></div>
                ) : supporters.map(s=>(
                  <div key={s._id} className="sup-card">
                    {!brokenSupIds[s._id] && (
                      <img
                        src={`/uploads/${s.image}`}
                        alt={s.name}
                        onError={()=>setBrokenSupIds(prev=>({ ...prev, [s._id]: true }))}
                      />
                    )}
                    <div className="sup-card-name">{s.name}</div>
                    <button className="btn-delete-sm" onClick={()=>deleteSupporter(s._id)}>🗑</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HELPERS */}
          {activeTab==='helpers' && (
            <div>
              <div className="section-header"><h3>Registered Partners ({helpers.length})</h3></div>
              {helpers.length===0 ? (
                <div className="empty-state"><span>🤝</span><p>No partners registered yet.</p></div>
              ) : (
                <div className="helpers-table-wrap">
                  <table className="data-table">
                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Country</th><th>City</th><th>Contact</th><th>Joined</th><th>Action</th></tr></thead>
                    <tbody>
                      {helpers.map((h,i)=>(
                        <tr key={h._id}>
                          <td>{i+1}</td>
                          <td><strong>{h.name}</strong></td>
                          <td>{h.email}</td>
                          <td>{h.country}</td>
                          <td>{h.city}</td>
                          <td>{h.contact}</td>
                          <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                          <td><button className="btn-delete-sm" onClick={()=>deleteHelper(h._id)}>🗑 Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MESSAGES */}
          {activeTab==='messages' && (
            <div>
              <div className="section-header"><h3>Contact Messages ({contacts.length})</h3></div>
              {contacts.length===0 ? (
                <div className="empty-state"><span>✉</span><p>No messages yet.</p></div>
              ) : (
                <div className="messages-list">
                  {contacts.map(msg=>(
                    <div key={msg._id} className={`message-card ${msg.read?'read':'unread'}`}>
                      <div className="msg-header">
                        <div className="msg-from"><strong>{msg.fullName}</strong><span>{msg.email}</span></div>
                        <div className="msg-meta">
                          <span className="msg-date">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
                          <button className="btn-delete-sm" onClick={()=>deleteMessage(msg._id)}>🗑 Delete</button>
                          {!msg.read&&<button className="btn-mark-read" onClick={()=>markRead(msg._id)}>Mark Read</button>}
                          {msg.read&&<span className="read-badge">✓ Read</span>}
                        </div>
                      </div>
                      <div className="msg-subject"><strong>Subject:</strong> {msg.subject}</div>
                      <div className="msg-body">{msg.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENT */}
          {activeTab==='payment' && (
            <div>
              <div className="announce-form-card">
                <h3>💛 Send Payment Thank-You Email</h3>
                <p className="announce-note">When a helper makes a donation/payment, select them here to send a thank-you email.</p>
                <div className="form-group">
                  <label>Select Helper *</label>
                  <select value={payHelperId} onChange={e=>setPayHelperId(e.target.value)}>
                    <option value="">-- Select a Helper --</option>
                    {helpers.map(h=><option key={h._id} value={h._id}>{h.name} ({h.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (₹) — optional</label>
                  <input type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)} placeholder="e.g. 500" />
                </div>
                <button className="btn-save" onClick={sendPaymentEmail} disabled={paySending} style={{padding:'12px 28px'}}>
                  {paySending ? 'Sending...' : '💛 Send Thank-You Email'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;