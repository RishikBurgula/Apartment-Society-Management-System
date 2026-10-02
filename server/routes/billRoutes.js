const express = require('express');
const Bill = require('../models/Bill');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = req.user.role === 'resident' ? { flat: req.user.flat } : {};
  const list = await Bill.find(filter).populate('flat', 'block flatNumber').sort({ createdAt: -1 });
  res.json(list);
});

router.post('/', protect, allowRoles('admin'), async (req, res) => {
  const b = await Bill.create(req.body);
  res.status(201).json(b);
});

router.put('/:id', protect, allowRoles('admin'), async (req, res) => {
  const b = await Bill.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(b);
});

module.exports = router;