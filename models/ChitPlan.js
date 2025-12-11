const mongoose = require('mongoose');

const chitPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true }, // Total amount
    duration_months: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChitPlan', chitPlanSchema);
