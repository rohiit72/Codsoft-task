const express = require('express');
const router = express.Router();

const studentRoutes = require('./studentRoutes');
const courseRoutes = require('./courseRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');

router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Student Record Management API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
