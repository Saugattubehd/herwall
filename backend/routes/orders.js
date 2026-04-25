const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, staffOnly } = require('../middleware/auth');

// Place order (auth required)
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items in order' });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone,
      items, totalAmount, paymentMethod, shippingAddress, notes,
      trackingHistory: [{ status: 'placed', note: 'Order placed successfully', updatedBy: req.user._id }]
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Track order by orderId (public with orderId)
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .select('orderId orderStatus trackingHistory totalAmount items userName createdAt');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders (staff)
router.get('/', protect, staffOnly, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { orderId: new RegExp(search, 'i') },
        { userName: new RegExp(search, 'i') },
        { userEmail: new RegExp(search, 'i') }
      ];
    }
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order (staff)
router.get('/:id', protect, staffOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (staff)
router.put('/:id/status', protect, staffOnly, async (req, res) => {
  try {
    const { orderStatus, note, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.trackingHistory.push({
        status: orderStatus, note: note || `Status updated to ${orderStatus}`,
        updatedBy: req.user._id
      });
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
