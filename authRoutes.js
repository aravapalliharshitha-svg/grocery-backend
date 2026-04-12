const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const auth = require('../middleware/auth'); // Import your middleware for the update route

// POST: Register a new secure user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ message: 'User already exists' }); }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: "Invalid email or password" }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: "Invalid email or password" }); }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        // UPDATED: Now sending groupCode back to frontend
        res.json({ 
            message: "Login successful", 
            token: token,
            name: user.name,
            groupCode: user.groupCode // This will be null if they haven't joined one yet
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// NEW ROUTE: Save the groupCode to the User's database profile
router.post('/update-group', auth, async (req, res) => {
    try {
        const { groupCode } = req.body;
        // Find user by ID (using the ID from the token via middleware)
        const user = await User.findById(req.user.id); 
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.groupCode = groupCode;
        await user.save();
        
        res.json({ message: "Group code saved successfully", groupCode: user.groupCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating group' });
    }
});

module.exports = router;