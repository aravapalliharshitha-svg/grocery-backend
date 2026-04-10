const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
// 1. GET items for a specific user
router.get('/:username', async (req, res) => {
  try {
    // This finds ONLY items where the user field matches the name in the URL
    const items = await Item.find({ user: req.params.username });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST a new item with a user label
router.post('/', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    user: req.body.user, 
    isCompleted: false
  });
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. DELETE ITEM 
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE/PATCH ITEM 
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id, 
      { isCompleted: req.body.isCompleted }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE an item (Edit name, category, or quantity)
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { 
        name: req.body.name, 
        category: req.body.category, 
        quantity: req.body.quantity 
      },
      { new: true } 
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;