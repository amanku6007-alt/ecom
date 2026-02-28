const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) { res.status(400); throw new Error('No order items'); }

  const order = await Order.create({
    user: req.user._id, orderItems, shippingAddress,
    paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
  });

  // Update stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, totalSold: item.quantity }
    });
  }

  res.status(201).json({ success: true, order });
});

// @GET /api/orders/my
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, orders });
});

// @GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.status(200).json({ success: true, order });
});

// @GET /api/orders  [Admin]
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = req.query.status ? { orderStatus: req.query.status } : {};

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments(filter)
  ]);

  res.status(200).json({ success: true, orders, total, pages: Math.ceil(total / limit), page });
});

// @PUT /api/orders/:id/status  [Admin]
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.orderStatus = req.body.orderStatus;
  if (req.body.orderStatus === 'delivered') order.deliveredAt = Date.now();
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  await order.save();

  res.status(200).json({ success: true, order });
});

// @DELETE /api/orders/:id  [Admin]
exports.deleteOrder = asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Order deleted' });
});
