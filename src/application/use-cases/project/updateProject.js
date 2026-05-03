const Project = require('../../../domain/entities/project');
const NotFoundError = require('../../../domain/errors/NotFoundError');
const ForbiddenError = require('../../../domain/errors/ForbiddenError');

class UpdateProject {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(projectId, userId, updateData) {
        // Verify user has access to the project
        const project = await this.projectRepository.findById(projectId, userId);
        if (!project) {
            throw new NotFoundError('Proyecto no encontrado');
        }

        // Only the owner can edit the project
        if (project.owner_id !== userId) {
            throw new ForbiddenError('Solo el propietario del proyecto puede editarlo');
        }

        const result = await this.projectRepository.update(projectId, updateData);
        return new Project(result);
    }
}

module.exports = UpdateProject;
