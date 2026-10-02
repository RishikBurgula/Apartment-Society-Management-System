const express = require('express');
const Notice = require('../models/Notice');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const notices = await Notice.find().populate('postedBy', 'name').sort({ createdAt: -1 });
  res.json(notices);
});

router.post('/', protect, allowRoles('admin'), async (req, res) => {
  const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(notice);
});

router.delete('/:id', protect, allowRoles('admin'), async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;