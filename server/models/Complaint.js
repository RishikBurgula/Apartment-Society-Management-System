const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'general' },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);