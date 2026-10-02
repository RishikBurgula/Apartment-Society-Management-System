const express = require('express');
const Complaint = require('../models/Complaint');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = req.user.role === 'resident' ? { raisedBy: req.user._id } : {};
  const list = await Complaint.find(filter).populate('raisedBy', 'name').sort({ createdAt: -1 });
  res.json(list);
});

router.post('/', protect, allowRoles('resident'), async (req, res) => {
  const c = await Complaint.create({ ...req.body, raisedBy: req.user._id, flat: req.user.flat });
  res.status(201).json(c);
});

router.put('/:id', protect, allowRoles('admin'), async (req, res) => {
  const c = await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(c);
});

module.exports = router;