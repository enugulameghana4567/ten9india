import React, { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import API from '../utils/api';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { API.get('/pages/contact').then(r => setData(r.data)).catch(() => {}); }, []);
  const c = data?.content || {};

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.subject || !form.message) {
      toast.error('Please fill all fields'); return;
    }
    setSubmitting(true);
    try {
      await API.post('/contact', form);
      toast.success('Message sent! We will get back to you soon. 🙏');
      setForm({ fullName: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="contact-page">
      <PageHero
        title={data?.title || 'Contact Us'}
        subtitle={data?.subtitle || 'We would love to hear from you'}
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80"
        badge="Contact"
      />
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="section-label">Reach Out</span>
              <h2>Get in Touch</h2>
              <div className="gold-bar"></div>
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div><strong>Email</strong><p>{c.email || 'info@ten9ministries.in'}</p></div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📱</div>
                  <div><strong>Phone</strong><p>{c.phone || '+91 00000 00000'}</p></div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div><strong>Address</strong><p>{c.address || 'TEN9 Ministries India'}</p></div>
                </div>
              </div>
              {c.closingMessage && <div className="contact-verse">{c.closingMessage}</div>}
            </div>
            <div className="contact-form-wrap">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="Message subject" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea name="message" rows="5" value={form.message} onChange={handleChange} placeholder="Your message..."></textarea>
                </div>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', padding: '14px' }}>
                  {submitting ? 'Sending...' : '✉ Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
