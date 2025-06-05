const express = require('express');
const bcrypt = require('bcrypt');
const { connectToDb } = require('../db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const db = await connectToDb();
  const users = db.collection('users');

  const existing = await users.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  await users.insertOne({ email, password: hashed, weights: [] });

  res.status(201).json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await connectToDb();
  const user = await db.collection('users').findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ email }); // Ideally use JWT in a real app
});

module.exports = router;
