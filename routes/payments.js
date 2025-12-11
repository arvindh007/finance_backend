const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const ChitPlan = require('../models/ChitPlan');
const ChitPlanCustomer = require('../models/ChitPlanCustomer');

// Get recent payments (Limited)
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('chit_plan_id')
            .populate('customer_id')
            .sort({ payment_date: -1 })
            .limit(6); // Limit to 6 as requested
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get ALL payments
router.get('/all', async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('chit_plan_id')
            .populate('customer_id')
            .sort({ payment_date: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Collection Stats
router.get('/stats', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 1; // Default to Today
        const date = new Date();

        let start = new Date();
        if (days === 1) {
            // Today 00:00
            start.setHours(0, 0, 0, 0);
        } else {
            // Last X days
            start.setDate(date.getDate() - days);
            start.setHours(0, 0, 0, 0);
        }

        const payments = await Payment.find({
            payment_date: { $gte: start }
        });

        const total = payments.reduce((sum, p) => sum + p.amount, 0);
        res.json({ total });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Record a payment
router.post('/', async (req, res) => {
    const payment = new Payment({
        chit_plan_id: req.body.chit_plan_id,
        customer_id: req.body.customer_id,
        customer_id: req.body.customer_id,
        amount: req.body.amount,
        notes: req.body.notes,
        payment_date: req.body.payment_date || Date.now()
    });

    try {
        const newPayment = await payment.save();
        res.status(201).json(newPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get history for a customer in a plan
router.get('/history/:planId/:customerId', async (req, res) => {
    try {
        const payments = await Payment.find({
            chit_plan_id: req.params.planId,
            customer_id: req.params.customerId
        }).sort({ payment_date: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Pending Status (The complex logic)
router.get('/pending', async (req, res) => {
    try {
        // Fetch all plans
        const plans = await ChitPlan.find();
        const results = [];

        for (const plan of plans) {
            // Calculate Daily Amount
            const monthlyInstallment = plan.amount / plan.duration_months;
            const dailyAmount = Math.ceil(monthlyInstallment / 30);

            // Days elapsed
            const startDate = new Date(plan.created_at);
            const now = new Date();
            const diffTime = Math.abs(now - startDate);
            const daysElapsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Expected amount so far
            const expectedAmount = daysElapsed * dailyAmount;

            // Get all customers in this plan
            const assignments = await ChitPlanCustomer.find({ chit_plan_id: plan._id }).populate('customer_id');

            for (const assignment of assignments) {
                const customer = assignment.customer_id;

                // Get total paid by this customer for this plan
                const payments = await Payment.find({
                    chit_plan_id: plan._id,
                    customer_id: customer._id
                });

                const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
                const pendingAmount = Math.max(0, expectedAmount - totalPaid);

                if (pendingAmount > 0) {
                    results.push({
                        plan_name: plan.name,
                        customer_name: customer.name,
                        phone: customer.phone,
                        daily_amount: dailyAmount,
                        days_elapsed: daysElapsed,
                        total_paid: totalPaid,
                        pending_amount: pendingAmount,
                        missed_days: Math.ceil(pendingAmount / dailyAmount)
                    });
                }
            }
        }
        res.json(results);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get payments for a specific plan on a specific date
router.get('/daily/:planId', async (req, res) => {
    try {
        const start = new Date(req.query.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.query.date);
        end.setHours(23, 59, 59, 999);

        const payments = await Payment.find({
            chit_plan_id: req.params.planId,
            payment_date: { $gte: start, $lte: end }
        });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
