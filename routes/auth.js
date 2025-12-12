const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup (Create Agent)
router.post('/signup', async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        // Check if phone exists
        const existing = await User.findOne({ phone });
        if (existing) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        const newUser = new User({
            name,
            phone,
            password, // In production, hash this!
            role: 'agent'
        });

        await newUser.save();
        res.status(201).json({ message: 'Agent created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body; // Identifier = phone or email

        // Hardcoded Admin Check
        if (identifier === 'admin@gmail.com' && password === 'admin123') {
            return res.json({
                id: 'admin_id',
                name: 'Admin',
                role: 'admin',
                token: 'admin_token' // Mock token
            });
        }

        // Agent Check
        const user = await User.findOne({ phone: identifier });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.json({
            id: user._id,
            name: user.name,
            role: user.role,
            token: 'mock_token_' + user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
