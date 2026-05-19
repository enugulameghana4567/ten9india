const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../config/mailer');
const { protect, ownerOnly } = require('../middleware/auth');

// Submit contact form (public)
router.post('/', async (req, res) => {
  const { fullName, email, subject, message } = req.body;
  try {
    const contact = await Contact.create({ fullName, email, subject, message });
    await sendContactNotification({ fullName, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all contacts (owner only)
router.get('/', protect, ownerOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark as read
router.put('/:id/read', protect, ownerOnly, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
