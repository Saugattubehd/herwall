const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, staffOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ active: true });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, staffOnly, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({ name, slug, description, image });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, staffOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, staffOnly, async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Category deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
