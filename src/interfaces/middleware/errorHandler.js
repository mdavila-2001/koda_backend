const AppError = require('../../domain/errors/AppError');

const errorHandler = (err, req, res, next) => {
    if (!err.isOperational) {
        console.error(`[Error no Manejado]`, err);
    }

    const statusCode = err.statusCode || 500;
    
    const message = err.isOperational ? err.message : 'Error Interno del Servidor';
    const status = err.status || 'error';

    res.status(statusCode).json({
        status: status,
        message: message,
        code: statusCode
    });
};

module.exports = errorHandler;