const express = require('express');
const Flat = require('../models/Flat');
const User = require('../models/User');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  res.json(await Flat.find().populate('owner', 'name'));
});

router.post('/', protect, allowRoles('admin'), async (req, res) => {
  res.status(201).json(await Flat.create(req.body));
});

router.get('/users/all', protect, allowRoles('admin'), async (req, res) => {
  res.json(await User.find().select('-password').populate('flat', 'block flatNumber'));
});

module.exports = router;