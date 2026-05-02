const Ticket = require('../../../domain/entities/ticket');

class GetProjectTickets {
    constructor(ticketRepository, projectRepository) {
        this.ticketRepository = ticketRepository;
        this.projectRepository = projectRepository;
    }

    async execute(userId, projectId) {
        // Verify multi-tenant access
        const project = await this.projectRepository.findById(projectId, userId);
        if (!project) {
            const err = new Error('Project not found or access denied');
            err.statusCode = 403;
            throw err;
        }

        const results = await this.ticketRepository.findByProjectId(projectId);
        return results.map(row => new Ticket(row));
    }
}

module.exports = GetProjectTickets;
