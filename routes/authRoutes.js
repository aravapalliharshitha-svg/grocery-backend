const express = require('express');
const router = express.Router();
const User = require('../models/User');

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "User created! You can now login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    res.json({ message: "Login successful", username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;