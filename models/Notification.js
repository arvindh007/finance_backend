const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    target: { type: String, enum: ['All', 'Agents', 'Customers'], required: true }, // Audience
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false } // Basic read status
});

module.exports = mongoose.model('Notification', notificationSchema);
