const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., "Login", "Create Agent"
    user: { type: String, required: true }, // Username or ID who performed the action
    details: { type: String }, // Additional info
    type: { type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' },
    ip: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
