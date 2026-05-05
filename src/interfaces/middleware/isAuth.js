const JwtService = require('../../infrastructure/security/jwt.service');
const jwtService = new JwtService();

const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        const err = new Error('No autorizado. Token faltante o formato incorrecto.');
        err.statusCode = 401;
        return next(err);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtService.verify(token);
        req.userId = decoded.id;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = isAuth;
