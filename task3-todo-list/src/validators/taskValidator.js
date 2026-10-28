const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  category: Joi.string().valid('Work', 'Personal', 'Study', 'Health', 'Finance', 'Other').default('Work'),
  dueDate: Joi.date().iso().allow(null).optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).optional(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  category: Joi.string().valid('Work', 'Personal', 'Study', 'Health', 'Finance', 'Other').optional(),
  dueDate: Joi.date().iso().allow(null).optional()
}).min(1);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'completed').required()
});

const queryTaskSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  category: Joi.string().valid('Work', 'Personal', 'Study', 'Health', 'Finance', 'Other').optional(),
  dueDate: Joi.date().iso().optional(),
  sortBy: Joi.string().valid('title', 'status', 'priority', 'dueDate', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc')
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  queryTaskSchema
};
