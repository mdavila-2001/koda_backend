const Project = require('../../../domain/entities/project');

class GetProjects {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(userId) {
        const results = await this.projectRepository.findByUserId(userId);
        return results.map(row => new Project(row));
    }
}

module.exports = GetProjects;
