/**
 * Express middleware to validate request body, query, or params using Joi schema
 * @param {import('joi').ObjectSchema} schema 
 * @param {'body' | 'query' | 'params'} property 
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message.replace(/['"]/g, '')
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: details
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = validate;
