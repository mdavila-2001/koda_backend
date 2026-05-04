const Project = require('../../../domain/entities/project');
const NotFoundError = require('../../../domain/errors/NotFoundError');
const ForbiddenError = require('../../../domain/errors/ForbiddenError');

class UpdateProject {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(projectId, userId, updateData) {
        const project = await this.projectRepository.findById(projectId, userId);
        if (!project) {
            throw new NotFoundError('Proyecto no encontrado');
        }

        if (project.owner_id !== userId) {
            throw new ForbiddenError('Solo el propietario del proyecto puede editarlo');
        }

        const result = await this.projectRepository.update(projectId, updateData);
        return new Project(result);
    }
}

module.exports = UpdateProject;
