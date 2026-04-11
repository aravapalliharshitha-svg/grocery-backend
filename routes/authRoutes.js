const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Check that your User model is capitalized like this!

// POST: Register a new secure user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash (scramble) the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and save the new user
        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User registered securely!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST: Authenticate user and get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; 

        // 1. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Create the JWT (VIP Pass)
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Expires in 1 day
        );

        // 4. Send token back to frontend
        res.json({ 
            message: "Login successful", 
            token: token,
            name: user.name 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;