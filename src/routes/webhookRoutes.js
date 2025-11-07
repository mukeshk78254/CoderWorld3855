/**
 * Razorpay Webhook Handler
 * Receives real-time payment notifications from Razorpay
 * 
 * IMPORTANT: This route must be registered BEFORE body-parser middleware
 * Add to server.js: app.use('/webhook', webhookRoutes);
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/users');

/**
 * Verify Razorpay webhook signature
 * This ensures the webhook request is genuine and from Razorpay
 */
const verifyWebhookSignature = (body, signature, secret) => {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex');
    
    return signature === expectedSignature;
};

/**
 * Handle payment.captured event
 * Called when a payment is successfully captured
 */
const handlePaymentCaptured = async (payload) => {
    try {
        const payment = payload.payment.entity;
        const orderId = payment.order_id;
        const paymentId = payment.id;
        const amount = payment.amount / 100; // Convert paise to rupees
        
        console.log('✅ Payment captured:', {
            orderId,
            paymentId,
            amount,
            status: payment.status
        });

        // Find user by order ID (stored in payment notes or order metadata)
        // You may need to query by order_id or payment_id depending on your implementation
        const user = await User.findOne({ orderId: orderId });
        
        if (user && !user.isPremium) {
            // Update user to premium if not already
            const startDate = new Date();
            const endDate = new Date();
            
            // Determine subscription duration based on amount
            if (amount === 1) { // Monthly plan
                endDate.setMonth(endDate.getMonth() + 1);
                user.subscriptionType = 'monthly';
            } else if (amount === 2) { // Yearly plan
                endDate.setFullYear(endDate.getFullYear() + 1);
                user.subscriptionType = 'yearly';
            }
            
            user.isPremium = true;
            user.subscriptionStartDate = startDate;
            user.subscriptionEndDate = endDate;
            user.paymentId = paymentId;
            
            await user.save();
            
            console.log('✅ User upgraded to premium:', user.emailId);
            
            // TODO: Send confirmation email to user
            // sendPaymentConfirmationEmail(user.emailId, { paymentId, orderId, amount });
        }
        
        return { success: true };
    } catch (error) {
        console.error('❌ Error handling payment.captured:', error);
        throw error;
    }
};

/**
 * Handle payment.failed event
 * Called when a payment fails
 */
const handlePaymentFailed = async (payload) => {
    try {
        const payment = payload.payment.entity;
        const orderId = payment.order_id;
        const paymentId = payment.id;
        const errorCode = payment.error_code;
        const errorDescription = payment.error_description;
        
        console.log('❌ Payment failed:', {
            orderId,
            paymentId,
            errorCode,
            errorDescription
        });
        
        // TODO: Send failure notification email
        // TODO: Log failure in database for analytics
        
        return { success: true };
    } catch (error) {
        console.error('❌ Error handling payment.failed:', error);
        throw error;
    }
};

/**
 * Handle subscription.charged event
 * Called when a subscription payment is processed
 */
const handleSubscriptionCharged = async (payload) => {
    try {
        const subscription = payload.subscription.entity;
        console.log('💳 Subscription charged:', subscription.id);
        
        // Handle subscription renewal logic
        // Similar to handlePaymentCaptured but for recurring payments
        
        return { success: true };
    } catch (error) {
        console.error('❌ Error handling subscription.charged:', error);
        throw error;
    }
};

/**
 * Main webhook endpoint
 * Route: POST /webhook/razorpay
 * 
 * IMPORTANT: No authentication middleware should be applied to this route
 * Razorpay needs direct access to send webhooks
 */
router.post('/razorpay', express.json(), async (req, res) => {
    try {
        console.log('\n📨 ============================================');
        console.log('📨 Webhook received from Razorpay');
        console.log('📨 ============================================');
        
        const signature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        
        // Check if webhook secret is configured
        if (!webhookSecret) {
            console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured in environment variables');
            return res.status(500).json({ 
                error: 'Webhook secret not configured',
                message: 'Please add RAZORPAY_WEBHOOK_SECRET to environment variables'
            });
        }
        
        // Verify webhook signature
        const isValid = verifyWebhookSignature(req.body, signature, webhookSecret);
        
        if (!isValid) {
            console.error('❌ Invalid webhook signature');
            return res.status(400).json({ 
                error: 'Invalid signature',
                message: 'Webhook signature verification failed'
            });
        }
        
        console.log('✅ Webhook signature verified');
        
        // Extract event type and payload
        const event = req.body.event;
        const payload = req.body.payload;
        
        console.log('📧 Event type:', event);
        console.log('📦 Payload:', JSON.stringify(payload, null, 2));
        
        // Handle different event types
        switch (event) {
            case 'payment.captured':
                await handlePaymentCaptured(payload);
                console.log('✅ payment.captured event processed');
                break;
                
            case 'payment.failed':
                await handlePaymentFailed(payload);
                console.log('✅ payment.failed event processed');
                break;
                
            case 'subscription.charged':
                await handleSubscriptionCharged(payload);
                console.log('✅ subscription.charged event processed');
                break;
                
            case 'order.paid':
                console.log('💰 Order paid event received');
                // Handle order.paid if needed
                break;
                
            default:
                console.log('ℹ️  Unhandled event type:', event);
        }
        
        // Always respond with 200 to acknowledge receipt
        res.status(200).json({ 
            status: 'ok',
            message: 'Webhook processed successfully',
            event: event
        });
        
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Still return 200 to prevent Razorpay from retrying
        // Log error internally but acknowledge receipt
        res.status(200).json({ 
            status: 'error',
            message: 'Webhook received but processing failed',
            error: error.message
        });
    }
});

/**
 * Test endpoint to verify webhook configuration
 * Route: GET /webhook/test
 * Use this to check if webhook route is accessible
 */
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Webhook endpoint is working',
        webhookUrl: `${process.env.BACKEND_URL || 'https://coderworld3855-5.onrender.com'}/webhook/razorpay`,
        configured: !!process.env.RAZORPAY_WEBHOOK_SECRET,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
