// ─────────────────────────────────────────────────────────────────────────────
// server/index.js
// ─────────────────────────────────────────────────────────────────────────────
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const https    = require('https');

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
    return callback(null, true);
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
      mongoSet:      !!process.env.MONGO_URI,
      ownerEmailSet: !!process.env.OWNER_EMAIL,
      ownerPassSet:  !!process.env.OWNER_PASSWORD,
      brevoSet:      !!process.env.BREVO_API_KEY
    }
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/owner',   require('./routes/owner'));
app.use('/api/pages',   require('./routes/pages'));
app.use('/api/helpers', require('./routes/helpers'));
app.use('/api/contact', require('./routes/contact'));

// ── Public supporters ─────────────────────────────────────────────────────────
app.get('/api/public/supporters', async (req, res) => {
  try {
    const Supporter = require('./models/Supporter');
    const list = await Supporter.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Test Email Route ──────────────────────────────────────────────────────────
app.get('/api/test-email', async (req, res) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return res.json({
      success: false,
      error: 'BREVO_API_KEY is not set in Render environment variables',
      fix: 'Go to Render → Environment → Add BREVO_API_KEY'
    });
  }

  const body = JSON.stringify({
    sender: { name: 'TEN9 Ministries India', email: 'ten9india@gmail.com' },
    to: [{ email: process.env.OWNER_EMAIL || 'ten9india@gmail.com' }],
    subject: 'TEN9 Ministries - Email Test',
    textContent: 'Brevo HTTP API is working correctly! Emails will reach any helper inbox.'
  });

  const options = {
    hostname: 'api.brevo.com',
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body)
    }
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log('✅ Test email sent via Brevo API');
        res.json({
          success: true,
          message: `Test email sent to ${process.env.OWNER_EMAIL}`,
          statusCode: response.statusCode
        });
      } else {
        console.error('❌ Brevo API error:', data);
        res.json({
          success: false,
          error: data,
          statusCode: response.statusCode,
          fix: 'Check your BREVO_API_KEY is correct in Render environment variables'
        });
      }
    });
  });

  request.on('error', (err) => {
    res.json({ success: false, error: err.message });
  });

  request.write(body);
  request.end();
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
      console.log(`   BREVO_API_KEY  : ${process.env.BREVO_API_KEY  ? '✅ SET' : '⚠️ NOT SET'}`);
      const { verifySMTP } = require('./config/mailer');
      await verifySMTP();
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection FAILED:', err.message);
    process.exit(1);
  });