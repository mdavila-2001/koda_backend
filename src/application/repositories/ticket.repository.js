class TicketRepository {
    constructor() {
        if (new.target === TicketRepository) {
            throw new Error('No se puede instanciar la interfaz TicketRepository directamente');
        }
    }

    async findById(ticketId) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: findById');
    }

    async findByProjectId(projectId) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: findByProjectId');
    }

    async create(ticket) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: create');
    }

    async update(ticketId, updateData) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: update');
    }

    async delete(ticketId) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED: delete');
    }
}

module.exports = TicketRepository;
