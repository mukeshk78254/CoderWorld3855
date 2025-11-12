const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * GET /api/settlements/pending
 * Check how much money is pending settlement
 */
router.get('/pending', async (req, res) => {
    try {
        // Get all payments from last 7 days
        const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
        
        const payments = await razorpay.payments.all({
            from: sevenDaysAgo,
            to: Math.floor(Date.now() / 1000),
            count: 100
        });

        // Calculate pending amount (captured but not settled)
        let pendingAmount = 0;
        let settledAmount = 0;
        
        for (const payment of payments.items) {
            if (payment.status === 'captured') {
                if (payment.settled) {
                    settledAmount += payment.amount;
                } else {
                    pendingAmount += payment.amount;
                }
            }
        }

        res.json({
            success: true,
            data: {
                pendingAmount: pendingAmount / 100, // Convert paise to rupees
                settledAmount: settledAmount / 100,
                totalPayments: payments.items.length,
                currency: 'INR'
            }
        });

    } catch (error) {
        console.error('Error fetching settlements:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch settlement data'
        });
    }
});

/**
 * GET /api/settlements/history
 * Get settlement history (when money was transferred to bank)
 */
router.get('/history', async (req, res) => {
    try {
        const settlements = await razorpay.settlements.all({
            count: 20 // Last 20 settlements
        });

        const formattedSettlements = settlements.items.map(settlement => ({
            id: settlement.id,
            amount: settlement.amount / 100, // Convert to rupees
            fees: settlement.fees / 100,
            tax: settlement.tax / 100,
            netAmount: (settlement.amount - settlement.fees - settlement.tax) / 100,
            currency: settlement.currency,
            status: settlement.status,
            utr: settlement.utr, // Unique Transaction Reference for bank statement
            settledAt: new Date(settlement.created_at * 1000).toLocaleString(),
            description: settlement.description
        }));

        res.json({
            success: true,
            data: formattedSettlements
        });

    } catch (error) {
        console.error('Error fetching settlement history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch settlement history'
        });
    }
});

/**
 * GET /api/settlements/dashboard
 * Quick overview for admin dashboard
 */
router.get('/dashboard', async (req, res) => {
    try {
        const [payments, settlements] = await Promise.all([
            razorpay.payments.all({ count: 100 }),
            razorpay.settlements.all({ count: 5 })
        ]);

        // Calculate stats
        let totalRevenue = 0;
        let pendingSettlement = 0;
        
        payments.items.forEach(payment => {
            if (payment.status === 'captured') {
                totalRevenue += payment.amount;
                if (!payment.settled) {
                    pendingSettlement += payment.amount;
                }
            }
        });

        const latestSettlement = settlements.items[0];

        res.json({
            success: true,
            data: {
                totalRevenue: totalRevenue / 100,
                pendingSettlement: pendingSettlement / 100,
                lastSettlement: latestSettlement ? {
                    amount: latestSettlement.amount / 100,
                    date: new Date(latestSettlement.created_at * 1000).toLocaleString(),
                    utr: latestSettlement.utr
                } : null,
                currency: 'INR'
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data'
        });
    }
});

/**
 * POST /api/settlements/instant
 * Request instant settlement (if enabled in Razorpay)
 */
router.post('/instant', async (req, res) => {
    try {
        const { amount, description } = req.body;

        // Note: Instant settlements need to be enabled in Razorpay Dashboard first
        const settlement = await razorpay.settlements.create({
            amount: amount * 100, // Convert rupees to paise
            settle_full_balance: false,
            description: description || 'Instant settlement request'
        });

        res.json({
            success: true,
            message: 'Instant settlement requested',
            data: {
                id: settlement.id,
                amount: settlement.amount / 100,
                status: settlement.status,
                fees: '₹10 + GST'
            }
        });

    } catch (error) {
        console.error('Error requesting instant settlement:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to request instant settlement',
            note: 'Make sure Instant Settlements are enabled in Razorpay Dashboard'
        });
    }
});

module.exports = router;
