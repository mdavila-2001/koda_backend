class ProjectRepository {
    constructor() {
        if (new.target === ProjectRepository) {
            throw new Error('No se puede instanciar la interfaz ProjectRepository directamente');
        }
    }

    async create(project) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: create');
    }

    async findByUserId(userId) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: findByUserId');
    }

    async findById(projectId, userId) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: findById');
    }

    async addMember(projectId, userId) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: addMember');
    }

    async getProjectMembers(projectId) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: getProjectMembers');
    }

    async update(projectId, updateData) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: update');
    }
}

module.exports = ProjectRepository;
