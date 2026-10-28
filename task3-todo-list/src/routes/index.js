const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'To-Do List API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
