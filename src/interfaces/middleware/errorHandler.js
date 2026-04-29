const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Error Interno del Servidor";

    res.status(statusCode).json({
        status: "Error",
        message: message,
        code: statusCode
    });
};

module.exports = errorHandler;