const AppError = require('./AppError');

class BusinessRuleError extends AppError {
    constructor(message = 'Violación de regla de negocio') {
        super(message, 400);
    }
}

module.exports = BusinessRuleError;
