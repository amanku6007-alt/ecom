const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @POST /api/payment/intent
exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // cents
    currency: 'usd',
    metadata: { userId: req.user._id.toString() },
  });
  res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @GET /api/payment/key
exports.getStripeKey = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, stripeKey: process.env.STRIPE_PUBLIC_KEY });
});
