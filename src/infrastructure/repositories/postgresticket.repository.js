const { Ticket } = require('../database/models');
const TicketRepository = require('../../application/repositories/ticket.repository');

class PostgresTicketRepository extends TicketRepository {
    _handleDatabaseError(error) {
        // Handle trigger exceptions (PostgreSQL Error Code P0001)
        if (error.parent?.code === 'P0001') {
            const customError = new Error(error.parent.message);
            customError.statusCode = 400;
            throw customError;
        }
        throw error;
    }

    async findById(ticketId) {
        const ticket = await Ticket.findByPk(ticketId);
        return ticket ? ticket.get({ plain: true }) : null;
    }

    async findByProjectId(projectId) {
        const tickets = await Ticket.findAll({
            where: { projectId: projectId },
            order: [['created_at', 'DESC']]
        });
        return tickets.map(t => t.get({ plain: true }));
    }

    async create({ project_id, title, description, status, assigned_user_id }) {
        try {
            const ticket = await Ticket.create({
                projectId: project_id,
                title,
                description,
                status: status || 'PENDING',
                assignedUserId: assigned_user_id
            });
            return ticket.get({ plain: true });
        } catch (error) {
            this._handleDatabaseError(error);
        }
    }

    async update(ticketId, updateData) {
        try {
            // Map snake_case to camelCase for Sequelize updateData if necessary
            const mappedData = {};
            if (updateData.title !== undefined) mappedData.title = updateData.title;
            if (updateData.description !== undefined) mappedData.description = updateData.description;
            if (updateData.status !== undefined) mappedData.status = updateData.status;
            if (updateData.assigned_user_id !== undefined) mappedData.assignedUserId = updateData.assigned_user_id;

            const [updatedCount, updatedTickets] = await Ticket.update(mappedData, {
                where: { id: ticketId },
                returning: true
            });

            return updatedCount > 0 ? updatedTickets[0].get({ plain: true }) : null;
        } catch (error) {
            this._handleDatabaseError(error);
        }
    }

    async delete(ticketId) {
        const ticket = await Ticket.findByPk(ticketId);
        if (ticket) {
            await ticket.destroy();
            return ticket.get({ plain: true });
        }
        return null;
    }
}

module.exports = PostgresTicketRepository;
