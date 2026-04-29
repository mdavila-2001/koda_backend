const bcrypt = require('bcryptjs');

class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {
        // 1. Regla de Negocio: Verificar si el email ya existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        // 2. Seguridad: Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Persistencia: Guardar en la DB
        return await this.userRepository.create({
            name,
            email,
            password: hashedPassword
        });
    }
}

module.exports = RegisterUser;