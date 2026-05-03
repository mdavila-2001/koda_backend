const AppError = require('./AppError');

class ForbiddenError extends AppError {
    constructor(message = 'Acceso denegado') {
        super(message, 403);
    }
}

module.exports = ForbiddenError;
