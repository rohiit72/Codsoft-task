const Joi = require('joi');

const createContactSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  phoneNumber: Joi.string().trim().pattern(/^[+0-9\s\-()]{7,25}$/).required()
    .messages({ 'string.pattern.base': 'Phone number format is invalid' }),
  street: Joi.string().trim().max(100).allow('', null).optional(),
  city: Joi.string().trim().max(50).allow('', null).optional(),
  state: Joi.string().trim().max(50).allow('', null).optional(),
  postalCode: Joi.string().trim().max(20).allow('', null).optional(),
  country: Joi.string().trim().max(50).allow('', null).optional(),
  companyName: Joi.string().trim().max(100).allow('', null).optional(),
  jobTitle: Joi.string().trim().max(100).allow('', null).optional(),
  department: Joi.string().trim().max(100).allow('', null).optional(),
  category: Joi.string().valid('Personal', 'Professional', 'Family', 'Other').default('Personal'),
  isFavorite: Joi.boolean().default(false),
  notes: Joi.string().trim().max(1000).allow('', null).optional()
});

const updateContactSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).optional(),
  lastName: Joi.string().trim().min(1).max(50).optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  phoneNumber: Joi.string().trim().pattern(/^[+0-9\s\-()]{7,25}$/).optional()
    .messages({ 'string.pattern.base': 'Phone number format is invalid' }),
  street: Joi.string().trim().max(100).allow('', null).optional(),
  city: Joi.string().trim().max(50).allow('', null).optional(),
  state: Joi.string().trim().max(50).allow('', null).optional(),
  postalCode: Joi.string().trim().max(20).allow('', null).optional(),
  country: Joi.string().trim().max(50).allow('', null).optional(),
  companyName: Joi.string().trim().max(100).allow('', null).optional(),
  jobTitle: Joi.string().trim().max(100).allow('', null).optional(),
  department: Joi.string().trim().max(100).allow('', null).optional(),
  category: Joi.string().valid('Personal', 'Professional', 'Family', 'Other').optional(),
  isFavorite: Joi.boolean().optional(),
  notes: Joi.string().trim().max(1000).allow('', null).optional()
}).min(1);

const queryContactSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  category: Joi.string().valid('Personal', 'Professional', 'Family', 'Other').optional(),
  companyName: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  isFavorite: Joi.boolean().optional(),
  sortBy: Joi.string().valid('firstName', 'lastName', 'email', 'companyName', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc')
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  queryContactSchema
};
