const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly, staffOnly, generateToken } = require('../middleware/auth');


// Dashboard stats
router.get('/stats', protect, staffOnly, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ active: true }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      totalOrders, totalUsers, totalProducts,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all staff (moderators)
router.get('/staff', protect, adminOnly, async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['moderator', 'admin'] } }).select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add moderator
router.post('/moderator', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const mod = await User.create({
      name, email, password, phone, role: 'moderator', addedBy: req.user._id
    });
    res.status(201).json({
      _id: mod._id, name: mod.name, email: mod.email,
      phone: mod.phone, role: mod.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove moderator
router.delete('/moderator/:id', protect, adminOnly, async (req, res) => {
  try {
    const mod = await User.findById(req.params.id);
    if (!mod || mod.role !== 'moderator')
      return res.status(404).json({ message: 'Moderator not found' });
    await User.findByIdAndUpdate(req.params.id, { role: 'user' });
    res.json({ message: 'Moderator removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
