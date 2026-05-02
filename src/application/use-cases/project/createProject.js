const Project = require('../../../domain/entities/project');

class CreateProject {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute({ name, description, owner_id }) {
        const result = await this.projectRepository.create({ name, description, owner_id });
        return new Project(result);
    }
}

module.exports = CreateProject;
