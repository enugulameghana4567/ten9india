const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  matter: { type: String, required: true },
  images: [{ type: String }], // stored filenames
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Helper' }]
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
