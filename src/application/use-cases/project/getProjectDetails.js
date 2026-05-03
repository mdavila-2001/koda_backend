const Project = require('../../../domain/entities/project');

class GetProjectDetails {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(projectId, userId) {
        const result = await this.projectRepository.findById(projectId, userId);
        
        if (!result) {
            const err = new Error('Project not found or access denied');
            err.statusCode = 404;
            throw err;
        }

        return new Project(result);
    }
}

module.exports = GetProjectDetails;
