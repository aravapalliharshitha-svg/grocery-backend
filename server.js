const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//  MIDDLEWARE
app.use(express.json()); 
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));

//  DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Warehouse! 🥗"))
  .catch((err) => console.log("Database connection error:", err));

//  ROUTES 
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send("Grocery Backend is live!");
});

//  START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Connected to MongoDB Warehouse! 🥗");
});