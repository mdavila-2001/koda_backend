const RegisterUser = require('../../application/use-cases/registerUser');
const LoginUser = require('../../application/use-cases/loginUser');
const PostgresUserRepository = require('../../infrastructure/repositories/postgresuser.repository');

// Inyectamos la dependencia manualmente (SOLID - Inversión de Dependencia)
const userRepository = new PostgresUserRepository();
const registerUseCase = new RegisterUser(userRepository);
const loginUseCase = new LoginUser(userRepository);

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const newUser = await registerUseCase.execute({ name, email, password });
            
            res.status(201).json({
                status: 'success',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await loginUseCase.execute({ email, password });
            
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();