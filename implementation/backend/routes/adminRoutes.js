const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const HealthTip = require('../models/tipModel');
const { adminCheck } = require('../middlewares/authMiddleware');

// Get all users
router.get('/users', adminCheck, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.patch('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return res
      .status(400)
      .json({ error: 'Role is required to update user role' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete a user
router.delete('/users/:id', adminCheck, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// GET all tips
router.get('/tips', async (req, res) => {
  try {
    const tips = await HealthTip.find();

    res.status(200).json(tips);
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

// POST a new tip
router.post('/tips', async (req, res) => {
  const { condition, tipText } = req.body;
  try {
    let tip = await HealthTip.findOne({ condition });

    if (tip) {
      tip.tips.push(tipText);
      await tip.save();
    } else {
      tip = await HealthTip.create({ condition, tips: [tipText] });
    }

    res.status(201).json(tip);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to add tip' });
  }
});

// DELETE a tip by ID
router.delete('/tips/:id', async (req, res) => {
  const { id } = req.params;
  const { tipText } = req.body;

  try {
    const updatedTip = await HealthTip.findByIdAndUpdate(
      id,
      { $pull: { tips: tipText } },
      { new: true }
    );

    if (updatedTip.tips.length === 0) {
      await HealthTip.findByIdAndDelete(id);
    }

    res.status(200).json({ message: 'Tip deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to delete tip' });
  }
});

// Test route for testing express-mongo-sanitize
router.post('/test-sanitize', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

// Test route for testing xss
router.post('/test-xss', (req, res) => {
  const userInput = req.body.input;
  res.send(`You submitted: ${userInput}`);
});

// Test route for testing hpp
router.post('/test-hpp', (req, res) => {
  const username = req.body.username;
  res.send(`Username received: ${username}`);
});

module.exports = router;
