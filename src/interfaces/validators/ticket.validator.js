const { z } = require('zod');

const createTicketSchema = z.object({
    title: z.string()
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(150, "El título debe tener máximo 150 caracteres"),
    description: z.string().optional(),
    project_id: z.string().uuid("ID de proyecto inválido"),
    assigned_user_id: z.string().uuid().nullable().optional()
});

const updateTicketSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
        errorMap: () => ({ message: "Estado no válido. Use: PENDING, IN_PROGRESS o COMPLETED" })
    }).optional(),
    assigned_user_id: z.string().uuid().nullable().optional()
});

module.exports = { createTicketSchema, updateTicketSchema };