const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ created_at: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a customer
router.post('/', async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a customer
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        if (req.body.name) customer.name = req.body.name;
        if (req.body.phone) customer.phone = req.body.phone;
        if (req.body.address) customer.address = req.body.address;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
