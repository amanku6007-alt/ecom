// paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent, getStripeKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
router.get('/key', protect, getStripeKey);
router.post('/intent', protect, createPaymentIntent);
module.exports = router;
