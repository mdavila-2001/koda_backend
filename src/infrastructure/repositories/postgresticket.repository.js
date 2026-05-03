const db = require('../database/db');
const TicketRepository = require('../../application/repositories/ticket.repository');

class PostgresTicketRepository extends TicketRepository {
    _handleDatabaseError(error) {
        if (error.code === 'P0001') {
            const customError = new Error(error.message);
            customError.statusCode = 400; // Bad Request
            throw customError;
        }
        throw error;
    }

    async findById(ticketId) {
        const { rows } = await db.query(
            'SELECT * FROM tickets WHERE id = $1',
            [ticketId]
        );
        return rows[0] || null;
    }

    async findByProjectId(projectId) {
        const { rows } = await db.query(
            'SELECT * FROM tickets WHERE project_id = $1 ORDER BY created_at DESC',
            [projectId]
        );
        return rows;
    }

    async create({ project_id, title, description, status, assigned_user_id }) {
        try {
            const { rows } = await db.query(
                `INSERT INTO tickets (project_id, title, description, status, assigned_user_id) 
                 VALUES ($1, $2, $3, COALESCE($4, 'PENDING')::ticket_status, $5) 
                 RETURNING *`,
                [project_id, title, description, status, assigned_user_id]
            );
            return rows[0];
        } catch (error) {
            this._handleDatabaseError(error);
        }
    }

    async update(ticketId, updateData) {
        try {
            const fields = [];
            const values = [];
            let query = 'UPDATE tickets SET ';
            
            let index = 1;
            for (const [key, value] of Object.entries(updateData)) {
                if (value !== undefined) {
                    if (key === 'status') {
                        fields.push(`status = $${index}::ticket_status`);
                    } else {
                        fields.push(`${key} = $${index}`);
                    }
                    values.push(value);
                    index++;
                }
            }

            if (fields.length === 0) return null;

            query += fields.join(', ');
            query += ` WHERE id = $${index} RETURNING *`;
            values.push(ticketId);

            const { rows } = await db.query(query, values);
            return rows[0] || null;
        } catch (error) {
            this._handleDatabaseError(error);
        }
    }

    async delete(ticketId) {
        const { rows } = await db.query(
            'DELETE FROM tickets WHERE id = $1 RETURNING *',
            [ticketId]
        );
        return rows[0] || null;
    }
}

module.exports = PostgresTicketRepository;
