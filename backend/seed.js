const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/herwall';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Create admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@herwall.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Herwall Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@Herwall2024',
      phone: process.env.ADMIN_PHONE || '9800000000',
      role: 'admin'
    });
    console.log('✅ Admin created:', adminEmail);
  } else {
    console.log('Admin already exists');
  }

  // Seed categories
  const cats = [
    { name: 'BTS', slug: 'bts', description: 'BTS K-pop posters' },
    { name: 'BLACKPINK', slug: 'blackpink', description: 'BLACKPINK posters' },
    { name: 'TWICE', slug: 'twice', description: 'TWICE posters' },
    { name: 'EXO', slug: 'exo', description: 'EXO posters' },
    { name: 'Stray Kids', slug: 'stray-kids', description: 'Stray Kids posters' },
    { name: 'NewJeans', slug: 'newjeans', description: 'NewJeans posters' },
    { name: 'Aesthetic', slug: 'aesthetic', description: 'Aesthetic art posters' },
  ];
  for (const cat of cats) {
    const exists = await Category.findOne({ slug: cat.slug });
    if (!exists) await Category.create(cat);
  }
  console.log('✅ Categories seeded');

  // Seed sample products
  const btsCat = await Category.findOne({ slug: 'bts' });
  const bpCat = await Category.findOne({ slug: 'blackpink' });

  const products = [
    {
      name: 'BTS Butter Concept Poster',
      slug: 'bts-butter-concept-poster',
      description: 'High quality BTS Butter album concept art poster print.',
      category: btsCat._id, artist: 'BTS',
      images: [], featured: true,
      sizes: [
        { size: 'A4 (8.3×11.7 in)', price: 299 },
        { size: 'A3 (11.7×16.5 in)', price: 499 },
        { size: 'A2 (16.5×23.4 in)', price: 799 }
      ],
      tags: ['bts', 'butter', 'kpop', 'poster']
    },
    {
      name: 'BLACKPINK Pink Venom Poster',
      slug: 'blackpink-pink-venom-poster',
      description: 'BLACKPINK Pink Venom era stunning poster.',
      category: bpCat._id, artist: 'BLACKPINK',
      images: [], featured: true,
      sizes: [
        { size: 'A4 (8.3×11.7 in)', price: 299 },
        { size: 'A3 (11.7×16.5 in)', price: 499 },
        { size: 'A2 (16.5×23.4 in)', price: 799 }
      ],
      tags: ['blackpink', 'pink venom', 'kpop', 'poster']
    }
  ];

  for (const p of products) {
    const exists = await Product.findOne({ slug: p.slug });
    if (!exists) await Product.create(p);
  }
  console.log('✅ Sample products seeded');

  mongoose.disconnect();
  console.log('🌸 Herwall database seeded successfully!');
};

seed().catch(console.error);
