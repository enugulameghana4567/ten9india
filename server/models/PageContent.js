const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  title: { type: String },
  subtitle: { type: String },
  content: { type: mongoose.Schema.Types.Mixed },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
}, { timestamps: true });

module.exports = mongoose.model('PageContent', pageContentSchema);
