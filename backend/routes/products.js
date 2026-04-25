const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, staffOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, artist, featured, search, page = 1, limit = 20 } = req.query;
    const query = { active: true };
    if (category) query.category = category;
    if (artist) query.artist = new RegExp(artist, 'i');
    if (featured) query.featured = true;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') },
      { artist: new RegExp(search, 'i') }
    ];
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .limit(Number(limit)).skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    const total = await Product.countDocuments(query);
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product (staff only)
router.post('/', protect, staffOnly, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, category, sizes, tags, artist, featured } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
    const images = req.files?.map(f => `/uploads/products/${f.filename}`) || [];
    const product = await Product.create({
      name, slug, description, category,
      sizes: JSON.parse(sizes || '[]'),
      tags: JSON.parse(tags || '[]'),
      artist, featured: featured === 'true', images
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/:id', protect, staffOnly, upload.array('images', 5), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.sizes) updates.sizes = JSON.parse(updates.sizes);
    if (updates.tags) updates.tags = JSON.parse(updates.tags);
    if (req.files?.length) updates.images = req.files.map(f => `/uploads/products/${f.filename}`);
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', protect, staffOnly, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
