const mongoose = require('mongoose');

const chitPlanCustomerSchema = new mongoose.Schema({
    chit_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChitPlan', required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    joined_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChitPlanCustomer', chitPlanCustomerSchema);
