const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Register user
router.post('/register', async (req, res) => {
  const { username, password, gender } = req.body;

  try {
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
      gender,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: 'User registered successfully!', userId: newUser._id });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      // Compare the entered password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        req.session.userId = user._id; // Store user ID in session
        req.session.role = user.role; // Store user role in session

        return res.status(200).json({
          message: 'Login successful',
          userId: user._id,
          role: user.role,
        });
      } else {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login error' });
  }
});

router.post('/api/users/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Logged out successfully' });
    console.log('Logged out successfully');
  });
});

// Get user details by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({
        username: user.username,
        gender: user.gender,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user details' });
  }
});

module.exports = router;
