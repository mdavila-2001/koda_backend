const { z } = require('zod');

const createProjectSchema = z.object({
    name: z.string()
        .min(3, "El nombre del proyecto es muy corto")
        .max(100),
    description: z.string()
        .max(500)
        .optional()
});

const addMemberSchema = z.object({
    user_id: z.string().uuid("ID de usuario inválido (UUID requerido)")
});

module.exports = { createProjectSchema, addMemberSchema };