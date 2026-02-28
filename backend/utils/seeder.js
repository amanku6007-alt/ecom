const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Electronics', description: 'Gadgets and devices', sortOrder: 1 },
  { name: 'Clothing', description: 'Fashion and apparel', sortOrder: 2 },
  { name: 'Books', description: 'Books and literature', sortOrder: 3 },
  { name: 'Home & Garden', description: 'Home accessories', sortOrder: 4 },
  { name: 'Sports', description: 'Sports and outdoors', sortOrder: 5 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);
  console.log('Cleared existing data');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User', email: 'admin@ecommerce.com', password: 'admin123', role: 'admin'
  });
  const regularUser = await User.create({
    name: 'John Doe', email: 'user@ecommerce.com', password: 'user123', role: 'user'
  });
  console.log('Created users: admin@ecommerce.com / admin123');

  // Create categories
  const cats = await Category.create(categories);
  console.log(`Created ${cats.length} categories`);

  // Create products
  const products = [];
  const sampleImages = [
    { public_id: 'sample', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  ];

  const productNames = [
    ['iPhone 15 Pro', 'Electronics', 999, 1099, 50],
    ['Samsung Galaxy S24', 'Electronics', 849, 949, 30],
    ['MacBook Air M3', 'Electronics', 1299, 1499, 20],
    ['Sony WH-1000XM5', 'Electronics', 349, 399, 45],
    ['Men\'s Slim Fit Jeans', 'Clothing', 59, 79, 100],
    ['Women\'s Running Shoes', 'Clothing', 89, 119, 80],
    ['Classic White T-Shirt', 'Clothing', 29, 39, 200],
    ['The Great Gatsby', 'Books', 14, 19, 150],
    ['Atomic Habits', 'Books', 16, 21, 120],
    ['Garden Planter Set', 'Home & Garden', 45, 65, 60],
    ['Yoga Mat Premium', 'Sports', 49, 69, 75],
    ['Protein Powder Vanilla', 'Sports', 39, 55, 90],
  ];

  for (const [name, catName, price, comparePrice, stock] of productNames) {
    const category = cats.find(c => c.name === catName);
    products.push({
      name, price, comparePrice, stock,
      description: `High quality ${name}. Perfect for everyday use with premium materials and exceptional performance.`,
      category: category._id,
      seller: admin._id,
      sku: 'SKU-' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
      images: [{ public_id: 'sample_' + name.replace(/\s/g,'_'), url: `https://picsum.photos/seed/${name.replace(/\s/g,'')}/400/400` }],
      ratings: (3.5 + Math.random() * 1.5).toFixed(1),
      numReviews: Math.floor(Math.random() * 50) + 5,
      isFeatured: Math.random() > 0.7,
      tags: [catName.toLowerCase(), 'popular'],
    });
  }

  await Product.create(products);
  console.log(`Created ${products.length} products`);
  console.log('\n✅ Seed complete!');
  console.log('Admin: admin@ecommerce.com / admin123');
  console.log('User:  user@ecommerce.com / user123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
