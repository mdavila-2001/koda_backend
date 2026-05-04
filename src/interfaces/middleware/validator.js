const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        status: 'error',
        message: "Error de Validación",
        details: formattedErrors
      });
    }
    
    next(error);
  }
};

module.exports = validate;