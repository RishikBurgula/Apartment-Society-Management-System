const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);