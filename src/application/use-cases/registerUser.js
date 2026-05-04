const bcrypt = require('bcryptjs');

class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error('Ya existe un usuario con este correo');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return await this.userRepository.create({
            name,
            email,
            password: hashedPassword
        });
    }
}

module.exports = RegisterUser;