const PostgresProjectRepository = require('../../infrastructure/repositories/postgresproject.repository');
const PostgresTicketRepository = require('../../infrastructure/repositories/postgresticket.repository');
const CreateTicket = require('../../application/use-cases/ticket/createTicket');
const GetProjectTickets = require('../../application/use-cases/ticket/getProjectTickets');
const UpdateTicket = require('../../application/use-cases/ticket/updateTicket');
const DeleteTicket = require('../../application/use-cases/ticket/deleteTicket');

// Manual Dependency Injection
const projectRepository = new PostgresProjectRepository();
const ticketRepository = new PostgresTicketRepository();

const createTicketUseCase = new CreateTicket(ticketRepository, projectRepository);
const getProjectTicketsUseCase = new GetProjectTickets(ticketRepository, projectRepository);
const updateTicketUseCase = new UpdateTicket(ticketRepository, projectRepository);
const deleteTicketUseCase = new DeleteTicket(ticketRepository, projectRepository);

class TicketController {
    async create(req, res, next) {
        try {
            const userId = req.userId;
            const ticketData = req.body;
            
            const newTicket = await createTicketUseCase.execute(userId, ticketData);
            
            res.status(201).json({
                status: 'success',
                data: newTicket
            });
        } catch (error) {
            next(error);
        }
    }

    async getByProjectId(req, res, next) {
        try {
            const userId = req.userId;
            const projectId = req.params.projectId;
            
            const tickets = await getProjectTicketsUseCase.execute(userId, projectId);
            
            res.status(200).json({
                status: 'success',
                data: tickets
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const userId = req.userId;
            const ticketId = req.params.id;
            const updateData = req.body;
            
            const updatedTicket = await updateTicketUseCase.execute(userId, ticketId, updateData);
            
            res.status(200).json({
                status: 'success',
                data: updatedTicket
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const userId = req.userId;
            const ticketId = req.params.id;
            
            const result = await deleteTicketUseCase.execute(userId, ticketId);
            
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TicketController();
