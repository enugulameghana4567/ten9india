const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Supporter = require('../models/Supporter');
const { protect } = require('../middleware/auth');

const helperOnly = (req, res, next) => {
  if (req.role !== 'helper') return res.status(403).json({ message: 'Helpers only' });
  next();
};

// Helper profile
router.get('/profile', protect, helperOnly, async (req, res) => {
  res.json(req.user);
});

// Get all announcements (helpers read-only)
router.get('/announcements', protect, async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    // Mark as read
    for (const ann of list) {
      if (!ann.readBy.includes(req.user._id)) {
        ann.readBy.push(req.user._id);
        await ann.save();
      }
    }
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Count unread announcements for this helper
router.get('/announcements/unread-count', protect, helperOnly, async (req, res) => {
  try {
    const count = await Announcement.countDocuments({ readBy: { $nin: [req.user._id] } });
    res.json({ count });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all supporters (helpers read-only)
router.get('/supporters', protect, async (req, res) => {
  try {
    const list = await Supporter.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
