const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter your name'], maxLength: [50, 'Name cannot exceed 50 characters'] },
  email: { type: String, required: [true, 'Please enter your email'], unique: true, lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
  password: { type: String, required: [true, 'Please enter your password'], minLength: [6, 'Password must be at least 6 characters'], select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { public_id: String, url: { type: String, default: 'https://ui-avatars.com/api/?background=6366f1&color=fff' } },
  phone: { type: String },
  addresses: [{
    name: String, street: String, city: String, state: String,
    zip: String, country: String, isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', userSchema);
