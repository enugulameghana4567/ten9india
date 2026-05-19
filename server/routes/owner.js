const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Helper = require('../models/Helper');
const Announcement = require('../models/Announcement');
const Supporter = require('../models/Supporter');
const { protect, ownerOnly } = require('../middleware/auth');
const { sendAnnouncementEmail, sendPaymentThankYou } = require('../config/mailer');

// ─── Multer setup ────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
router.get('/helpers', protect, ownerOnly, async (req, res) => {
  try {
    const helpers = await Helper.find().select('name email country city contact createdAt').sort({ createdAt: -1 });
    res.json(helpers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────
// Create announcement + notify all helpers by email
router.post('/announcements', protect, ownerOnly, upload.array('images', 5), async (req, res) => {
  const { title, matter } = req.body;
  if (!title || !matter) return res.status(400).json({ message: 'Title and matter are required' });
  try {
    const images = (req.files || []).map(f => f.filename);
    const announcement = await Announcement.create({ title, matter, images, createdBy: req.user._id });

    // Notify all helpers by email
    const helpers = await Helper.find().select('name email');
    const emailPromises = helpers.map(h => sendAnnouncementEmail(h.name, h.email, title, matter));
    await Promise.allSettled(emailPromises);

    res.status(201).json(announcement);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all announcements (owner)
router.get('/announcements', protect, ownerOnly, async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete announcement
router.delete('/announcements/:id', protect, ownerOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── SUPPORTERS ──────────────────────────────────────────────────────────────
router.post('/supporters', protect, ownerOnly, upload.single('image'), async (req, res) => {
  const { name } = req.body;
  if (!name || !req.file) return res.status(400).json({ message: 'Name and image are required' });
  try {
    const supporter = await Supporter.create({ name, image: req.file.filename, addedBy: req.user._id });
    res.status(201).json(supporter);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/supporters', protect, ownerOnly, async (req, res) => {
  try {
    const list = await Supporter.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/supporters/:id', protect, ownerOnly, async (req, res) => {
  try {
    const s = await Supporter.findById(req.params.id);
    if (s) {
      const imgPath = path.join(uploadDir, s.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      await Supporter.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── PAYMENT — trigger thank-you email ───────────────────────────────────────
router.post('/payment-confirm', protect, ownerOnly, async (req, res) => {
  const { helperId, amount } = req.body;
  try {
    const helper = await Helper.findById(helperId).select('name email');
    if (!helper) return res.status(404).json({ message: 'Helper not found' });
    await sendPaymentThankYou(helper.name, helper.email, amount);
    res.json({ message: `Payment thank-you email sent to ${helper.email}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
