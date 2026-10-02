const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  block: { type: String, required: true },
  flatNumber: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['occupied', 'vacant'], default: 'vacant' }
}, { timestamps: true });

module.exports = mongoose.model('Flat', flatSchema);