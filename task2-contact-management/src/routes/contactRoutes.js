const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const validate = require('../middleware/validate');
const {
  createContactSchema,
  updateContactSchema,
  queryContactSchema
} = require('../validators/contactValidator');

// Contacts Analytics & Stats (placed before /:id)
router.get('/stats', contactController.getContactStats);

// Contact CRUD endpoints
router.post('/', validate(createContactSchema, 'body'), contactController.createContact);
router.get('/', validate(queryContactSchema, 'query'), contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', validate(updateContactSchema, 'body'), contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
