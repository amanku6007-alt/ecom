const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// Advanced filter/search/paginate helper
const buildQuery = (queryStr) => {
  let q = { ...queryStr };
  ['page','limit','sort','keyword','fields'].forEach(k => delete q[k]);
  q = JSON.parse(JSON.stringify(q).replace(/\b(gt|gte|lt|lte)\b/g, m => `$${m}`));
  return q;
};

// @GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  let query = buildQuery(req.query);
  query.isActive = true;

  if (req.query.keyword) {
    query.$text = { $search: req.query.keyword };
  }

  let dbQuery = Product.find(query).populate('category', 'name slug');

  if (req.query.sort) {
    dbQuery = dbQuery.sort(req.query.sort.split(',').join(' '));
  } else {
    dbQuery = dbQuery.sort('-createdAt');
  }

  dbQuery = dbQuery.skip(skip).limit(limit);

  const [products, total] = await Promise.all([dbQuery, Product.countDocuments(query)]);

  res.status(200).json({
    success: true, products, total,
    pages: Math.ceil(total / limit), page, limit,
  });
});

// @GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.status(200).json({ success: true, product });
});

// @POST /api/products  [Admin]
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.seller = req.user._id;
  if (!req.body.sku) {
    req.body.sku = 'SKU-' + Date.now();
  }
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @PUT /api/products/:id  [Admin]
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.status(200).json({ success: true, product });
});

// @DELETE /api/products/:id  [Admin]
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @GET /api/products/featured
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).populate('category', 'name');
  res.status(200).json({ success: true, products });
});

// @POST /api/products/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('Product already reviewed'); }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.ratings = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});
