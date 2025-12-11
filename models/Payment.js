const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    chit_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChitPlan', required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    notes: { type: String, default: '' },
    payment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
