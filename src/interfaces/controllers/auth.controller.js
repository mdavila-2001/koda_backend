const RegisterUser = require('../../application/use-cases/registerUser');
const PostgresUserRepository = require('../../infrastructure/repositories/postgresuser.repository');

// Inyectamos la dependencia manualmente (SOLID - Inversión de Dependencia)
const userRepository = new PostgresUserRepository();
const registerUseCase = new RegisterUser(userRepository);

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const newUser = await registerUseCase.execute({ name, email, password });
            
            res.status(201).json({
                status: 'success',
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            });
        } catch (error) {
            next(error); // Pasa el error al errorHandler de Marcelo
        }
    }
}

module.exports = new AuthController();