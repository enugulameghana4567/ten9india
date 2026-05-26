// ─────────────────────────────────────────────────────────────────────────────
// server/index.js
// ─────────────────────────────────────────────────────────────────────────────
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'https://ten9-india.vercel.app',
      'https://ten9-india-git-main-enugulameghana4567s-projects.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    if (!origin || allowed.includes(origin) ||
        (origin && origin.includes('vercel.app'))) {
      return callback(null, true);
    }
    return callback(null, true); // allow all for now
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'TEN9 Ministries India Server is running',
    time: new Date().toISOString(),
    env: {
      mongoSet:       !!process.env.MONGO_URI,
      ownerEmailSet:  !!process.env.OWNER_EMAIL,
      ownerPassSet:   !!process.env.OWNER_PASSWORD,
      brevoSet:       !!process.env.BREVO_USER && !!process.env.BREVO_PASS
    }
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/owner',   require('./routes/owner'));
app.use('/api/pages',   require('./routes/pages'));
app.use('/api/helpers', require('./routes/helpers'));
app.use('/api/contact', require('./routes/contact'));

app.get('/api/public/supporters', async (req, res) => {
  try {
    const Supporter = require('./models/Supporter');
    const list = await Supporter.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Resend Test Route ─────────────────────────────────────────────────────────
// Open in browser: https://ten9india.onrender.com/api/test-email
app.get('/api/test-email', async (req, res) => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    return res.json({
      success: false,
      error: 'GMAIL_USER or GMAIL_APP_PASSWORD is not set',
      fix: 'Go to Render → Environment → Add GMAIL_USER and GMAIL_APP_PASSWORD'
    });
  }

  try {
    const nodemailer = require('nodemailer');
    const cleanPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.GMAIL_USER, pass: cleanPass },
      tls: { rejectUnauthorized: false }
    });
    await transporter.verify();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to:   process.env.GMAIL_USER,
      subject: 'TEN9 Ministries - Email Test',
      text: 'Gmail SMTP is working correctly!'
    });
    res.json({ success: true, message: 'Test email sent to ' + process.env.GMAIL_USER });
  } catch (err) {
    res.json({ success: false, error: err.message,
      fix: 'Check GMAIL_USER and GMAIL_APP_PASSWORD in Render environment variables'
    });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ten9ministries';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected → database: ten9ministries');
    app.listen(PORT, async () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`   OWNER_EMAIL    : ${process.env.OWNER_EMAIL    || '⚠️ NOT SET'}`);
      console.log(`   OWNER_PASSWORD : ${process.env.OWNER_PASSWORD ? '✅ SET' : '⚠️ NOT SET'}`);
      console.log(`   BREVO_USER     : ${process.env.BREVO_USER     || '⚠️ NOT SET'}`);
      const { verifySMTP } = require('./config/mailer');
      await verifySMTP();
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection FAILED:', err.message);
    process.exit(1);
  });