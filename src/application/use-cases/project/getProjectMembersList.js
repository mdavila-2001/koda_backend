class GetProjectMembersList {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId, userId) {
    const project = await this.projectRepository.findById(projectId, userId);
    if (!project) {
      const error = new Error('Project not found or access denied');
      error.statusCode = 404;
      throw error;
    }

    return await this.projectRepository.getProjectMembers(projectId);
  }
}

module.exports = GetProjectMembersList;
