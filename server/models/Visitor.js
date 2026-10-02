const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  purpose: String,
  flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: Date,
  loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);