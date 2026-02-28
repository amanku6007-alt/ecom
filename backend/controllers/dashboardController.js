const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders, monthOrders, lastMonthOrders,
    totalUsers, monthUsers,
    totalProducts, lowStockProducts,
    revenueResult, monthRevenueResult,
    recentOrders,
    topProducts,
    ordersByStatus
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 10 }, isActive: true }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.find().populate('user', 'name email').sort('-createdAt').limit(5),
    Product.find({ isActive: true }).sort('-totalSold').limit(5).populate('category', 'name'),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
  ]);

  // Monthly revenue chart (last 6 months)
  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders, monthOrders, lastMonthOrders,
      totalUsers, monthUsers,
      totalProducts, lowStockProducts,
      totalRevenue: revenueResult[0]?.total || 0,
      monthRevenue: monthRevenueResult[0]?.total || 0,
    },
    recentOrders,
    topProducts,
    ordersByStatus,
    monthlyRevenue,
  });
});
