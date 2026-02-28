const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @GET /api/users  [Admin]
exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments()
  ]);
  res.status(200).json({ success: true, users, total, pages: Math.ceil(total / limit), page });
});

// @GET /api/users/:id  [Admin]
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.status(200).json({ success: true, user });
});

// @PUT /api/users/:id  [Admin]
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, email, role, isActive }, { new: true });
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.status(200).json({ success: true, user });
});

// @DELETE /api/users/:id  [Admin]
exports.deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'User deleted' });
});

// @PUT /api/users/address  [User]
exports.updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});
