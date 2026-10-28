const Joi = require('joi');

const createStudentSchema = Joi.object({
  studentIdNumber: Joi.string().trim().alphanum().min(3).max(20).required(),
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().trim().pattern(/^[+0-9\s\-()]{7,20}$/).optional().allow('', null),
  dateOfBirth: Joi.date().iso().less('now').required(),
  department: Joi.string().trim().min(2).max(100).required(),
  enrollmentYear: Joi.number().integer().min(1990).max(2050).required(),
  status: Joi.string().valid('Active', 'Inactive', 'Graduated', 'Suspended').default('Active')
});

const updateStudentSchema = Joi.object({
  studentIdNumber: Joi.string().trim().alphanum().min(3).max(20).optional(),
  firstName: Joi.string().trim().min(2).max(50).optional(),
  lastName: Joi.string().trim().min(1).max(50).optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  phone: Joi.string().trim().pattern(/^[+0-9\s\-()]{7,20}$/).optional().allow('', null),
  dateOfBirth: Joi.date().iso().less('now').optional(),
  department: Joi.string().trim().min(2).max(100).optional(),
  enrollmentYear: Joi.number().integer().min(1990).max(2050).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Graduated', 'Suspended').optional()
}).min(1);

const queryStudentSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  department: Joi.string().trim().optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Graduated', 'Suspended').optional(),
  enrollmentYear: Joi.number().integer().optional(),
  sortBy: Joi.string().valid('firstName', 'lastName', 'email', 'enrollmentYear', 'createdAt', 'studentIdNumber').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc')
});

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  queryStudentSchema
};
