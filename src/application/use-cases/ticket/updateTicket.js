const Ticket = require('../../../domain/entities/ticket');
const NotFoundError = require('../../../domain/errors/NotFoundError');
const ForbiddenError = require('../../../domain/errors/ForbiddenError');
const BusinessRuleError = require('../../../domain/errors/BusinessRuleError');

class UpdateTicket {
    constructor(ticketRepository, projectRepository) {
        this.ticketRepository = ticketRepository;
        this.projectRepository = projectRepository;
    }

    async execute(userId, ticketId, updateData) {
        const currentTicket = await this.ticketRepository.findById(ticketId);
        if (!currentTicket) {
            throw new NotFoundError('Ticket no encontrado');
        }

        const project = await this.projectRepository.findById(currentTicket.project_id, userId);
        if (!project) {
            throw new ForbiddenError('Acceso denegado para actualizar este ticket');
        }

        if (updateData.status && updateData.status !== currentTicket.status) {
            const validTransitions = {
                'PENDING': ['IN_PROGRESS'],
                'IN_PROGRESS': ['COMPLETED'],
                'COMPLETED': []
            };

            const allowedStates = validTransitions[currentTicket.status] || [];
            
            if (!allowedStates.includes(updateData.status)) {
                throw new BusinessRuleError(`Transición de estado inválida de ${currentTicket.status} a ${updateData.status}. Las transiciones permitidas son lineales (PENDIENTE -> EN_PROGRESO -> COMPLETADO).`);
            }
        }

        const result = await this.ticketRepository.update(ticketId, updateData);
        return new Ticket(result);
    }
}

module.exports = UpdateTicket;
