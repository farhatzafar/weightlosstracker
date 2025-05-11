const express = require('express');
const bcrypt = require('bcrypt');
const { Low, JSONFile } = require('lowdb');
const router = express.Router();

const adapter = new JSONFile('db.json');
const db = new Low(adapter);
db.read().then(() => {
  db.data ||= { users: [] };
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = db.data.users.find(user => user.email === email);
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  db.data.users.push({ email, password: hashed, weights: [] });
  await db.write();
  res.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.data.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ email });
});

module.exports = router;
