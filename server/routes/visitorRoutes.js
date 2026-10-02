const express = require('express');
const Visitor = require('../models/Visitor');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = req.user.role === 'resident' ? { flat: req.user.flat } : {};
  const list = await Visitor.find(filter).populate('flat', 'block flatNumber').sort({ entryTime: -1 });
  res.json(list);
});

router.post('/', protect, allowRoles('guard', 'admin'), async (req, res) => {
  const v = await Visitor.create({ ...req.body, loggedBy: req.user._id });
  res.status(201).json(v);
});

router.put('/:id/exit', protect, allowRoles('guard', 'admin'), async (req, res) => {
  const v = await Visitor.findByIdAndUpdate(req.params.id, { exitTime: new Date() }, { new: true });
  res.json(v);
});

module.exports = router;