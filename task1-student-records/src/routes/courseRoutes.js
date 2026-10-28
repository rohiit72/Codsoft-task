const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const enrollmentController = require('../controllers/enrollmentController');
const validate = require('../middleware/validate');
const {
  createCourseSchema,
  updateCourseSchema,
  queryCourseSchema
} = require('../validators/courseValidator');

// CRUD routes for Courses
router.post('/', validate(createCourseSchema, 'body'), courseController.createCourse);
router.get('/', validate(queryCourseSchema, 'query'), courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', validate(updateCourseSchema, 'body'), courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Enrolled students for a course
router.get('/:id/students', enrollmentController.getStudentsByCourse);

module.exports = router;
