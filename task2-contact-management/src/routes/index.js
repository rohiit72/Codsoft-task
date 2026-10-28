const express = require('express');
const router = express.Router();
const contactRoutes = require('./contactRoutes');

router.use('/contacts', contactRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Contact Management System API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
