const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true }, // Sparse allows null/unique for admin email usage
    email: { type: String, unique: true, sparse: true }, // For admin
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
