const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const weightRoutes = require('./routes/weights');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/weight', weightRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
