const express = require('express');
const { connectToDb } = require('../db');
const router = express.Router();

// Add new weight
router.post('/add', async (req, res) => {
  const { email, weight, date } = req.body;
  const db = await connectToDb();
  const users = db.collection('users');

  const result = await users.updateOne(
    { email },
    { $push: { weights: { date, weight } } }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: 'Weight updated' });
});

// Get weight history
router.get('/history', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Assume token is the email

  const db = await connectToDb();
  const user = await db.collection('users').findOne({ email: token });

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ history: user.weights || [] });
});

module.exports = router;
