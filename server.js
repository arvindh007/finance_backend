const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', require('./routes/customers'));
app.use('/api/chits', require('./routes/chits'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('Chit Fund API is running');
});

// Database Connection
const MONGO_URI = 'mongodb+srv://namabusiness7_db_user:cT8pwydYbuh5iiym@cluster0.dfeoowh.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
