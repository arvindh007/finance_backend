const express = require('express');
const router = express.Router();
const ChitPlan = require('../models/ChitPlan');
const ChitPlanCustomer = require('../models/ChitPlanCustomer');

// Get all chit plans
router.get('/', async (req, res) => {
    try {
        const plans = await ChitPlan.find().sort({ created_at: -1 });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a chit plan
router.post('/', async (req, res) => {
    console.log('Creating chit plan:', req.body);
    const plan = new ChitPlan({
        name: req.body.name,
        amount: req.body.amount,
        duration_months: req.body.duration_months
    });

    try {
        const newPlan = await plan.save();

        // Assign customers if provided
        if (req.body.customer_ids && Array.isArray(req.body.customer_ids)) {
            const customerIds = req.body.customer_ids;
            const assignments = customerIds.map(customerId => ({
                chit_plan_id: newPlan._id,
                customer_id: customerId
            }));
            await ChitPlanCustomer.insertMany(assignments);
        }

        res.status(201).json(newPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add customer to chit plan
router.post('/assign', async (req, res) => {
    const assignment = new ChitPlanCustomer({
        chit_plan_id: req.body.chit_plan_id,
        customer_id: req.body.customer_id
    });

    try {
        const newAssignment = await assignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get customers for a specific plan
router.get('/:id/customers', async (req, res) => {
    try {
        const assignments = await ChitPlanCustomer.find({ chit_plan_id: req.params.id })
            .populate('customer_id');
        res.json(assignments.map(a => a.customer_id));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
