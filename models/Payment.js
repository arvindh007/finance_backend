const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    chit_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChitPlan', required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String },
    collectedBy: { type: String }, // Stores Agent Name
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
