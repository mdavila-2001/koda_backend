const { z } = require('zod');

const createTicketSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(150, "Title must be at most 150 characters"),
    description: z.string().optional(),
    project_id: z.string().uuid("Invalid project ID"),
    assigned_user_id: z.string().uuid().nullable().optional()
});

const updateTicketSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
        errorMap: () => ({ message: "Invalid status. Use: PENDING, IN_PROGRESS or COMPLETED" })
    }).optional(),
    assigned_user_id: z.string().uuid().nullable().optional()
});

module.exports = { createTicketSchema, updateTicketSchema };