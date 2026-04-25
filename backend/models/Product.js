const mongoose = require('mongoose');

const sizeVariantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. "A4", "A3", "A2", "12x18", "24x36"
  price: { type: Number, required: true },
  stock: { type: Number, default: 100 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  sizes: [sizeVariantSchema],
  tags: [{ type: String }],
  artist: { type: String }, // BTS, BLACKPINK etc
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
