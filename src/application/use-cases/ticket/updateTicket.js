const Ticket = require('../../../domain/entities/ticket');

class UpdateTicket {
    constructor(ticketRepository, projectRepository) {
        this.ticketRepository = ticketRepository;
        this.projectRepository = projectRepository;
    }

    async execute(userId, ticketId, updateData) {
        // 1. Get current ticket to extract project_id
        const currentTicket = await this.ticketRepository.findById(ticketId);
        if (!currentTicket) {
            const err = new Error('Ticket not found');
            err.statusCode = 404;
            throw err;
        }

        // 2. Verify multi-tenant access to the ticket's project
        const project = await this.projectRepository.findById(currentTicket.project_id, userId);
        if (!project) {
            const err = new Error('Access denied to update this ticket');
            err.statusCode = 403;
            throw err;
        }

        // 3. Delegate update to repository
        const result = await this.ticketRepository.update(ticketId, updateData);
        return new Ticket(result);
    }
}

module.exports = UpdateTicket;
