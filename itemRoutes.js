const auth = require('./middleware/auth');
const express = require('express');
const router = express.Router();
const Item = require('./models/Item');
// 1. GET items for the logged-in user (Secure)
router.get('/:groupCode', auth, async (req, res) => {
  try {
    // Finds items that match the group code
    const items = await Item.find({ groupCode: req.params.groupCode });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 2. POST a new item with a user label
router.post('/', auth, async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      user: req.user.id, // Make sure this matches your middleware (req.user.id)
      groupCode: req.body.groupCode 
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}); // This should be the ONLY closing bracket for the route

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
// UPDATE/PATCH ITEM (Checklist toggle)
router.patch('/:id', auth, async (req, res) => {
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