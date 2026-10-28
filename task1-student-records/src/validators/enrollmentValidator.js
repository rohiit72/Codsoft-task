const Joi = require('joi');

const createEnrollmentSchema = Joi.object({
  studentId: Joi.number().integer().positive().required(),
  courseId: Joi.number().integer().positive().required(),
  enrollmentDate: Joi.date().iso().default(() => new Date().toISOString().split('T')[0]),
  grade: Joi.string().valid('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'Pending').default('Pending'),
  status: Joi.string().valid('Enrolled', 'Completed', 'Dropped').default('Enrolled')
});

const updateEnrollmentSchema = Joi.object({
  grade: Joi.string().valid('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'Pending').optional(),
  status: Joi.string().valid('Enrolled', 'Completed', 'Dropped').optional()
}).min(1);

const queryEnrollmentSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  studentId: Joi.number().integer().positive().optional(),
  courseId: Joi.number().integer().positive().optional(),
  status: Joi.string().valid('Enrolled', 'Completed', 'Dropped').optional(),
  grade: Joi.string().valid('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'Pending').optional(),
  sortBy: Joi.string().valid('enrollmentDate', 'createdAt', 'grade', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc')
});

module.exports = {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  queryEnrollmentSchema
};
