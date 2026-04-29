const { z } = require('zod');

/**
 * Middleware genérico para validar el cuerpo de la petición (req.body)
 * @param {z.ZodSchema} schema - El esquema de validación de Zod
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
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
};

module.exports = validate;