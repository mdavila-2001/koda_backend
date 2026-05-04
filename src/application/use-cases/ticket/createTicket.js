const Ticket = require('../../../domain/entities/ticket');

class CreateTicket {
    constructor(ticketRepository, projectRepository) {
        this.ticketRepository = ticketRepository;
        this.projectRepository = projectRepository;
    }

    async execute(userId, ticketData) {
        const { project_id } = ticketData;

        const project = await this.projectRepository.findById(project_id, userId);
        if (!project) {
            const err = new Error('Project not found or access denied');
            err.statusCode = 403;
            throw err;
        }

        const result = await this.ticketRepository.create(ticketData);
        return new Ticket(result);
    }
}

module.exports = CreateTicket;
