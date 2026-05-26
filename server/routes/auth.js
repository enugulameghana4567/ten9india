// ─────────────────────────────────────────────────────────────────────────────
// server/routes/auth.js
// ─────────────────────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Helper  = require('../models/Helper');
const { sendOTPEmail, sendWelcomeEmail } = require('../config/mailer');

// In-memory OTP store for signup only
const signupOtpStore = {};

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || 'ten9secret', { expiresIn: '7d' });

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─────────────────────────────────────────────────────────────────────────────
//  OWNER LOGIN — credentials from .env, no DB
//  POST /api/auth/owner/login
// ─────────────────────────────────────────────────────────────────────────────
router.post('/owner/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const ownerEmail    = (process.env.OWNER_EMAIL    || 'ten9india@gmail.com').toLowerCase().trim();
  const ownerPassword =  process.env.OWNER_PASSWORD || 'chelsea123';

  if (email.toLowerCase().trim() !== ownerEmail || password !== ownerPassword)
    return res.status(401).json({ message: 'Invalid owner credentials' });

  const token = jwt.sign(
    { id: 'owner_static', role: 'owner' },
    process.env.JWT_SECRET || 'ten9secret',
    { expiresIn: '7d' }
  );
  return res.json({
    token,
    user: { id: 'owner_static', name: 'Ten9 Owner', email: ownerEmail, role: 'owner' }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER SIGNUP — Step 1: Send OTP
//  POST /api/auth/helper/send-otp
// ─────────────────────────────────────────────────────────────────────────────
router.post('/helper/send-otp', async (req, res) => {
  const { name, country, city, email, contact, password } = req.body;

  if (!name || !country || !city || !email || !contact || !password)
    return res.status(400).json({ message: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Please enter a valid email address' });

  const cleanEmail = email.toLowerCase().trim();

  try {
    const existing = await Helper.findOne({ email: cleanEmail });
    if (existing)
      return res.status(400).json({ message: 'This email is already registered. Please login.' });

    const otp = generateOTP();
    signupOtpStore[cleanEmail] = {
      otp, name: name.trim(), country: country.trim(),
      city: city.trim(), contact: contact.trim(), password,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    console.log(`\n📧 SIGNUP OTP | ${cleanEmail} | ${otp}\n`);

    const sent = await sendOTPEmail(name.trim(), cleanEmail, otp);
    if (!sent) {
      delete signupOtpStore[cleanEmail];
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again in a moment.',
        debug: 'Check Render logs for exact error'
      });
    }

    return res.json({ message: `Verification code sent to ${cleanEmail}. Valid for 10 minutes.` });
  } catch (err) {
    console.error('❌ /helper/send-otp:', err.message);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER SIGNUP — Step 2: Verify OTP & create account
//  POST /api/auth/helper/verify-otp
// ─────────────────────────────────────────────────────────────────────────────
router.post('/helper/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required' });

  const cleanEmail = email.toLowerCase().trim();
  const record     = signupOtpStore[cleanEmail];

  if (!record)
    return res.status(400).json({ message: 'No code found. Please go back and request a new code.' });
  if (Date.now() > record.expiresAt) {
    delete signupOtpStore[cleanEmail];
    return res.status(400).json({ message: 'Code expired. Please register again.' });
  }
  if (record.otp !== otp.toString().trim())
    return res.status(400).json({ message: 'Incorrect code. Please try again.' });

  try {
    const helper = await Helper.create({
      name: record.name, country: record.country, city: record.city,
      email: cleanEmail, contact: record.contact, password: record.password
    });
    delete signupOtpStore[cleanEmail];
    console.log(`✅ Helper registered: ${helper.name} <${helper.email}>`);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(helper.name, helper.email).catch(err =>
      console.error('Welcome email failed (account still created):', err.message)
    );

    return res.status(201).json({
      token: generateToken(helper._id, 'helper'),
      user: {
        id: helper._id, name: helper.name, email: helper.email,
        role: 'helper', country: helper.country, city: helper.city, contact: helper.contact
      }
    });
  } catch (err) {
    console.error('❌ /helper/verify-otp:', err.message);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER LOGIN — Email only, direct login (no password, no OTP)
//  POST /api/auth/helper/login
// ─────────────────────────────────────────────────────────────────────────────
router.post('/helper/login', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim())
    return res.status(400).json({ message: 'Email address is required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim()))
    return res.status(400).json({ message: 'Please enter a valid email address' });

  const cleanEmail = email.toLowerCase().trim();

  try {
    const helper = await Helper.findOne({ email: cleanEmail }).select('-password');
    if (!helper)
      return res.status(404).json({
        message: 'No account found with this email. Please sign up first.'
      });

    console.log(`✅ Helper login: ${helper.name} <${helper.email}>`);

    return res.json({
      token: generateToken(helper._id, 'helper'),
      user: {
        id: helper._id, name: helper.name, email: helper.email,
        role: 'helper', country: helper.country, city: helper.city, contact: helper.contact
      }
    });
  } catch (err) {
    console.error('❌ /helper/login:', err.message);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
