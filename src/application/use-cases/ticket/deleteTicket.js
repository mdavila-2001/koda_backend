const NotFoundError = require('../../../domain/errors/NotFoundError');
const ForbiddenError = require('../../../domain/errors/ForbiddenError');

class DeleteTicket {
    constructor(ticketRepository, projectRepository) {
        this.ticketRepository = ticketRepository;
        this.projectRepository = projectRepository;
    }

    async execute(userId, ticketId) {
        // Verify ticket exists
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError('Ticket no encontrado');
        }

        // Verify user belongs to the ticket's project
        const project = await this.projectRepository.findById(ticket.project_id, userId);
        if (!project) {
            throw new ForbiddenError('Acceso denegado para eliminar este ticket');
        }

        await this.ticketRepository.delete(ticketId);
        return { message: 'Ticket eliminado exitosamente' };
    }
}

module.exports = DeleteTicket;
