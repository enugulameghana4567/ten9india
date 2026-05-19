// ─────────────────────────────────────────────────────────────────────────────
// server/index.js
// ─────────────────────────────────────────────────────────────────────────────
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');
const nodemailer = require('nodemailer');

// Load .env FIRST before anything else
dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'https://ten9india.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images (supporter photos, announcement images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/owner',   require('./routes/owner'));
app.use('/api/pages',   require('./routes/pages'));
app.use('/api/helpers', require('./routes/helpers'));
app.use('/api/contact', require('./routes/contact'));

// ── Public: Supporters (no auth — used on the public /supporters page) ────────
app.get('/api/public/supporters', async (req, res) => {
  try {
    const Supporter = require('./models/Supporter');
    const list = await Supporter.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  SMTP TEST ROUTE
//  Open in browser → http://localhost:5000/api/test-email
//  Shows exactly what is wrong with your email config
//  You can DELETE this route once email is confirmed working
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/test-email', async (req, res) => {
  const result = {
    smtpUser:    process.env.SMTP_USER    || null,
    smtpPassSet: !!process.env.SMTP_PASS,
    smtpPassLen: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
    ownerEmail:  process.env.OWNER_EMAIL  || null,
    step:        '',
    success:     false,
    error:       null,
    fix:         null
  };

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    result.step  = 'CONFIG CHECK';
    result.error = 'SMTP_USER or SMTP_PASS is not set in server/.env';
    result.fix   = 'Open server/.env and set SMTP_USER=ten9india@gmail.com and SMTP_PASS=your16charapppassword';
    return res.json(result);
  }

  // Remove ALL spaces from password before using (common mistake)
  const cleanPass = process.env.SMTP_PASS.replace(/\s/g, '');
  result.smtpPassLen = cleanPass.length;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: cleanPass
    },
    tls: { rejectUnauthorized: false }
  });

  try {
    result.step = 'VERIFY';
    await transporter.verify();
    result.step = 'SEND';

    await transporter.sendMail({
      from:    `"TEN9 Test" <${process.env.SMTP_USER}>`,
      to:      process.env.SMTP_USER,    // send to yourself as test
      subject: 'TEN9 Ministries — SMTP Test',
      html:    '<h2 style="color:#8B1A1A;">SMTP is working!</h2><p>Your TEN9 email system is correctly configured.</p>'
    });

    result.success = true;
    result.step    = 'DONE';
    console.log('✅ Test email sent to', process.env.SMTP_USER);

  } catch (err) {
    result.error = err.message;
    result.step  = result.step + ' FAILED';

    if (err.message.includes('Invalid login') || err.message.includes('Username and Password')) {
      result.fix =
        'Your SMTP_PASS (Gmail App Password) is WRONG. Steps: ' +
        '(1) Go to myaccount.google.com/security ' +
        '(2) Enable 2-Step Verification if OFF ' +
        '(3) Go to myaccount.google.com/apppasswords ' +
        '(4) Create new App Password named "TEN9 Mailer" ' +
        '(5) Copy the 16-char code with NO spaces into SMTP_PASS in server/.env ' +
        '(6) Save .env and type rs + Enter in nodemon terminal';
    } else if (err.message.includes('ECONNREFUSED')) {
      result.fix = 'Cannot connect to Gmail. Check your internet connection.';
    } else {
      result.fix = 'Check your SMTP_USER and SMTP_PASS in server/.env';
    }

    console.error('❌ SMTP test failed:', err.message);
  }

  res.json(result);
});

// ─────────────────────────────────────────────────────────────────────────────
//  Startup banner — shows all config at once in terminal
// ─────────────────────────────────────────────────────────────────────────────
const printBanner = () => {
  const pass = process.env.SMTP_PASS || '';
  // Remove spaces for real length check
  const cleanPass = pass.replace(/\s/g, '');

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║      TEN9 MINISTRIES INDIA  —  SERVER       ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  PORT          : ${String(process.env.PORT || 5000).padEnd(27)}║`);
  console.log(`║  MONGO_URI     : ${process.env.MONGO_URI ? '✅ SET' : '❌ NOT SET — check .env'}`.padEnd(49) + '║');
  console.log(`║  OWNER_EMAIL   : ${(process.env.OWNER_EMAIL || '⚠️  using default').padEnd(27)}║`);
  console.log(`║  OWNER_PASS    : ${(process.env.OWNER_PASSWORD ? '✅ SET' : '⚠️  using default').padEnd(27)}║`);
  console.log(`║  SMTP_USER     : ${(process.env.SMTP_USER || '❌ NOT SET').padEnd(27)}║`);

  if (!process.env.SMTP_PASS) {
    console.log('║  SMTP_PASS     : ❌ NOT SET                      ║');
  } else if (cleanPass.length !== 16) {
    console.log(`║  SMTP_PASS     : ⚠️  ${cleanPass.length} chars (should be 16)       ║`);
  } else {
    console.log('║  SMTP_PASS     : ✅ SET (16 chars)               ║');
  }

  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  Test email → http://localhost:5000/api/test-email  ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // Warnings
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  WARNING: SMTP not configured. NO emails will be sent.\n');
  } else if (cleanPass.length !== 16) {
    console.warn(`⚠️  WARNING: SMTP_PASS has ${cleanPass.length} chars (expected 16).`);
    console.warn('   Gmail App Passwords are exactly 16 characters (no spaces).\n');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  Connect MongoDB → start server → verify SMTP
// ─────────────────────────────────────────────────────────────────────────────
const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ten9ministries';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected → database: ten9ministries');

    app.listen(PORT, async () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      printBanner();

      // Auto-verify SMTP on startup
      const { verifySMTP } = require('./config/mailer');
      await verifySMTP();
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection FAILED:', err.message);
    console.error('   → Check MONGO_URI in server/.env');
    process.exit(1);
  });