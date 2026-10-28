const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const enrollmentController = require('../controllers/enrollmentController');
const validate = require('../middleware/validate');
const {
  createStudentSchema,
  updateStudentSchema,
  queryStudentSchema
} = require('../validators/studentValidator');

// CRUD routes for Students
router.post('/', validate(createStudentSchema, 'body'), studentController.createStudent);
router.get('/', validate(queryStudentSchema, 'query'), studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.put('/:id', validate(updateStudentSchema, 'body'), studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Student's enrollments route
router.get('/:id/enrollments', enrollmentController.getEnrollmentsByStudent);

module.exports = router;
