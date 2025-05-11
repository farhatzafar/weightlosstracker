const express = require('express');
const { Low, JSONFile } = require('lowdb');
const router = express.Router();

const adapter = new JSONFile('db.json');
const db = new Low(adapter);
db.read().then(() => {
  db.data ||= { users: [] };
});

// Add a new weight entry
router.post('/update', async (req, res) => {
  const { email, weight } = req.body;
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.weights.push({ date: new Date().toLocaleDateString(), weight });
  await db.write();
  res.json({ message: 'Weight updated' });
});

// Get weight history
router.get('/:email', async (req, res) => {
  const user = db.data.users.find(u => u.email === req.params.email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.weights || []);
});

module.exports = router;
