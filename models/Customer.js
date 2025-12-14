const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    idProof: { type: String }, // URL or Doc ID
    emergencyContact: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
