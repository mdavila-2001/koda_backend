const errorHandler = (err, req, res, next) => {
    console.error(`[Error]`, err);

    const statusCode = err.statusCode || 500;
    
    const message = statusCode === 500 
        ? "Error Interno del Servidor" 
        : err.message;

    res.status(statusCode).json({
        status: "error",
        message: message,
        code: statusCode
    });
};

module.exports = errorHandler;