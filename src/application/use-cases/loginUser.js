const bcrypt = require('bcryptjs');

class LoginUser {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async execute({ email, password }) {
        // 1. Verificar si el usuario existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        // 2. Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        // 3. Generar el Token JWT
        const token = this.jwtService.sign({ id: user.id, email: user.email });

        // 4. Retornar los datos (sin el hash de la contraseña)
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
}

module.exports = LoginUser;
