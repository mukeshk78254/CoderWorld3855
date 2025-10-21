const express = require('express');
const router = express.Router();
const usermiddleware = require('../middleware/middle');
const { createOrder, verifyPayment, getSubscriptionStatus, testRazorpayConfig } = require('../controllers/paymentcontroller');


router.get('/test-config', testRazorpayConfig);


router.post('/create-order', usermiddleware, createOrder);
router.post('/verify-payment', usermiddleware, verifyPayment);
router.get('/subscription-status', usermiddleware, getSubscriptionStatus);

module.exports = router;
