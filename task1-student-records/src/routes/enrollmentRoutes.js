const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const validate = require('../middleware/validate');
const {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  queryEnrollmentSchema
} = require('../validators/enrollmentValidator');

// CRUD routes for Enrollments
router.post('/', validate(createEnrollmentSchema, 'body'), enrollmentController.createEnrollment);
router.get('/', validate(queryEnrollmentSchema, 'query'), enrollmentController.getAllEnrollments);
router.get('/:id', enrollmentController.getEnrollmentById);
router.put('/:id', validate(updateEnrollmentSchema, 'body'), enrollmentController.updateEnrollment);
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;
