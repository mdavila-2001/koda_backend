class AddProjectMember {
    constructor(projectRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    async execute(projectId, ownerId, emailToAdd) {
        // First verify that the current user is the OWNER of the project
        const project = await this.projectRepository.findById(projectId, ownerId);
        
        if (!project) {
            const err = new Error('Project not found or access denied');
            err.statusCode = 404;
            throw err;
        }
        
        if (project.owner_id !== ownerId) {
            const err = new Error('Only the project owner can add members');
            err.statusCode = 403;
            throw err;
        }

        const userExists = await this.userRepository.findByEmail(emailToAdd);
        if (!userExists) {
            const err = new Error('User with this email not found');
            err.statusCode = 404;
            throw err;
        }

        if (project.owner_id === userExists.id) {
            const err = new Error('User is already the owner of this project');
            err.statusCode = 400;
            throw err;
        }

        const result = await this.projectRepository.addMember(projectId, userExists.id);
        return result || { message: 'User is already a member of this project' };
    }
}

module.exports = AddProjectMember;
