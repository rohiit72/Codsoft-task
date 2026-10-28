const Joi = require('joi');

const createCourseSchema = Joi.object({
  courseCode: Joi.string().trim().uppercase().min(2).max(15).required(),
  title: Joi.string().trim().min(3).max(150).required(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  credits: Joi.number().integer().min(1).max(10).required(),
  department: Joi.string().trim().min(2).max(100).required(),
  instructor: Joi.string().trim().min(2).max(100).required(),
  maxCapacity: Joi.number().integer().min(1).max(500).default(40)
});

const updateCourseSchema = Joi.object({
  courseCode: Joi.string().trim().uppercase().min(2).max(15).optional(),
  title: Joi.string().trim().min(3).max(150).optional(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  credits: Joi.number().integer().min(1).max(10).optional(),
  department: Joi.string().trim().min(2).max(100).optional(),
  instructor: Joi.string().trim().min(2).max(100).optional(),
  maxCapacity: Joi.number().integer().min(1).max(500).optional()
}).min(1);

const queryCourseSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  department: Joi.string().trim().optional(),
  instructor: Joi.string().trim().optional(),
  credits: Joi.number().integer().optional(),
  sortBy: Joi.string().valid('courseCode', 'title', 'credits', 'department', 'createdAt', 'maxCapacity').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc')
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  queryCourseSchema
};
