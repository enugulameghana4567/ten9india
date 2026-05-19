const mongoose = require('mongoose');

const supporterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
}, { timestamps: true });

module.exports = mongoose.model('Supporter', supporterSchema);
