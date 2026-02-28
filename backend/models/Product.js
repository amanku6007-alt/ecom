const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter product name'], trim: true, maxLength: [200, 'Name cannot exceed 200 characters'] },
  description: { type: String, required: [true, 'Please enter product description'] },
  price: { type: Number, required: [true, 'Please enter product price'], maxLength: [8, 'Price cannot exceed 8 digits'] },
  comparePrice: { type: Number },
  images: [{ public_id: { type: String, required: true }, url: { type: String, required: true } }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  stock: { type: Number, required: [true, 'Please enter product stock'], maxLength: [5, 'Stock cannot exceed 5 digits'], default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, rating: { type: Number, required: true },
    comment: { type: String, required: true }, createdAt: { type: Date, default: Date.now } }],
  tags: [String],
  sku: { type: String, unique: true },
  weight: { type: Number },
  dimensions: { length: Number, width: Number, height: Number },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalSold: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
