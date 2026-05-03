const jwt = require('jsonwebtoken');

class JwtService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        if (!this.secret) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }
    }

    sign(payload, options = { expiresIn: '24h' }) {
        return jwt.sign(payload, this.secret, options);
    }

    verify(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            const err = new Error('Token inválido o expirado');
            err.statusCode = 401;
            throw err;
        }
    }
}

module.exports = JwtService;
