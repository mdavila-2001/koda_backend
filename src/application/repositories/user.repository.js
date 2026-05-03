class UserRepository {
    constructor() {
        if (new.target === UserRepository) {
            throw new Error('No se puede instanciar la interfaz UserRepository directamente');
        }
    }

    async findByEmail(email) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: findByEmail');
    }

    async findById(id) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: findById');
    }

    async create(user) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: create');
    }
}

module.exports = UserRepository;
