const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/users');


const getRazorpayInstance = () => {
    try {
        
        console.log(' Checking Razorpay credentials...');
        console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 
            `${process.env.RAZORPAY_KEY_ID.substring(0, 10)}...` : 'NOT FOUND');
        console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 
            `${process.env.RAZORPAY_KEY_SECRET.substring(0, 5)}...` : 'NOT FOUND');

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('❌ Razorpay credentials missing in .env file!');
            throw new Error('Razorpay credentials not configured');
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        
        console.log(' Razorpay instance created successfully');
        return instance;
    } catch (error) {
        console.error(' Failed to create Razorpay instance:', error.message);
        throw error;
    }
};


exports.createOrder = async (req, res) => {
    try {
        console.log('\n ============================================');
        console.log(' Payment create-order request received');
        console.log(' ============================================');
        console.log('Request body:', req.body);
        console.log('Request headers authorization:', req.headers.authorization ? 'Present' : 'Missing');
        console.log('User from middleware:', req.ans1 ? 'Present' : 'Missing');
        
        
        let razorpay;
        try {
            razorpay = getRazorpayInstance();
        } catch (error) {
            console.error(' Failed to get Razorpay instance:', error.message);
            return res.status(500).json({ 
                error: 'Payment gateway not configured',
                details: 'Razorpay credentials are missing or invalid. Please contact support.',
                hint: 'Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file'
            });
        }

       
        if (!req.ans1) {
            console.error(' req.ans1 is undefined - authentication middleware may have failed');
            return res.status(401).json({ 
                error: 'User not authenticated',
                details: 'Please login again'
            });
        }

        const { amount, planType } = req.body;
        const userId = req.ans1._id || req.ans1.id;

        console.log('User ID:', userId);
        console.log('Plan Type:', planType);
        console.log('Amount:', amount);

        
        if (!userId) {
            console.error(' User ID is missing');
            return res.status(401).json({ 
                error: 'User not authenticated',
                details: 'User ID not found in authentication token'
            });
        }

      
        if (!amount || !planType) {
            console.error(' Missing required fields');
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: 'Both amount and planType are required',
                received: { amount, planType }
            });
        }

      
        if (!['monthly', 'yearly'].includes(planType)) {
            console.error(' Invalid plan type:', planType);
            return res.status(400).json({ 
                error: 'Invalid plan type',
                details: 'Plan type must be "monthly" or "yearly"',
                received: planType
            });
        }


        const expectedAmount = planType === 'monthly' ? 100 : 200;
        if (amount !== expectedAmount) {
            console.error(` Invalid amount. Expected: ${expectedAmount}, Received: ${amount}`);
            return res.status(400).json({ 
                error: 'Invalid amount for selected plan',
                expected: expectedAmount,
                received: amount,
                details: `${planType} plan costs ₹${expectedAmount / 100}`
            });
        }

        console.log(' All validations passed. Creating Razorpay order...');

     
        const timestamp = Date.now();
        const shortUserId = userId.toString().substring(0, 8);
        const receiptId = `rcpt_${timestamp}_${shortUserId}`;
        
        console.log('Receipt ID length:', receiptId.length, 'chars');

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: receiptId,
            notes: {
                userId: userId.toString(),
                planType: planType
            }
        };

        console.log('Razorpay order options:', options);

        const order = await razorpay.orders.create(options);
        console.log(' Order created successfully:', order.id);
        console.log('Order details:', JSON.stringify(order, null, 2));

        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error(' Error creating order:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        
        if (error.error) {
            console.error('Razorpay error details:', error.error);
        }

        res.status(500).json({ 
            error: 'Failed to create order',
            message: error.message,
            details: error.error?.description || error.description || 'Please try again or contact support',
            code: error.error?.code || error.code || 'UNKNOWN_ERROR'
        });
    }
};


exports.verifyPayment = async (req, res) => {
    try {
        console.log(' Payment verification request received');
        console.log('Request body:', req.body);
        
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;
        
        
        if (!req.ans1) {
            console.error(' User not authenticated');
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        const userId = req.ans1._id || req.ans1.id;
        console.log('Verifying payment for user:', userId);

       
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planType) {
            console.error(' Missing required fields for verification');
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: 'All payment details are required for verification'
            });
        }

        console.log('Order ID:', razorpay_order_id);
        console.log('Payment ID:', razorpay_payment_id);
        console.log('Plan Type:', planType);

       
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        console.log('Expected signature:', expectedSign);
        console.log('Received signature:', razorpay_signature);

        if (razorpay_signature !== expectedSign) {
            console.error(' Invalid payment signature');
            return res.status(400).json({ 
                error: 'Invalid payment signature',
                details: 'Payment verification failed. Please contact support.'
            });
        }

        console.log(' Signature verified successfully');

      
        const startDate = new Date();
        const endDate = new Date();
        if (planType === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (planType === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        console.log('Subscription period:', startDate, 'to', endDate);

       
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isPremium: true,
                subscriptionType: planType,
                subscriptionStartDate: startDate,
                subscriptionEndDate: endDate,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id
            },
            { new: true }
        );

        if (!updatedUser) {
            console.error(' User not found:', userId);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(' Payment verified and user updated to premium');

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully! Welcome to CoderWorld Premium! 🎉',
            subscription: {
                type: planType,
                startDate: startDate,
                endDate: endDate,
                isPremium: true
            }
        });
    } catch (error) {
        console.error(' Error verifying payment:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            error: 'Payment verification failed',
            details: error.message
        });
    }
};


exports.testRazorpayConfig = async (req, res) => {
    try {
        console.log('\n Testing Razorpay Configuration...');
        console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
        console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
        console.log('Key ID value:', process.env.RAZORPAY_KEY_ID);
        console.log('Key Secret value:', process.env.RAZORPAY_KEY_SECRET ? '***' + process.env.RAZORPAY_KEY_SECRET.slice(-4) : 'N/A');

        const razorpay = getRazorpayInstance();
        
        res.status(200).json({
            success: true,
            message: 'Razorpay is configured correctly!',
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            details: 'Razorpay configuration test failed'
        });
    }
};


exports.getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.ans1._id || req.ans1.id;
        const user = await User.findById(userId).select('isPremium subscriptionType subscriptionEndDate subscriptionStartDate');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

       
        if (user.isPremium && user.subscriptionEndDate && user.subscriptionEndDate < new Date()) {
            await User.findByIdAndUpdate(userId, { isPremium: false });
            user.isPremium = false;
        }

        res.status(200).json({
            success: true,
            subscription: {
                isPremium: user.isPremium || false,
                type: user.subscriptionType,
                startDate: user.subscriptionStartDate,
                endDate: user.subscriptionEndDate
            }
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ error: 'Failed to fetch subscription status' });
    }
};
