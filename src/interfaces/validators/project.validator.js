const { z } = require('zod');

const createProjectSchema = z.object({
    name: z.string()
        .min(3, "El nombre del proyecto debe tener al menos 3 caracteres")
        .max(100),
    description: z.string()
        .max(500)
        .optional()
});

const addMemberSchema = z.object({
    email: z.string().email({ message: "Formato de correo electrónico inválido" })
});

const updateProjectSchema = z.object({
    name: z.string()
        .min(3, "El nombre del proyecto debe tener al menos 3 caracteres")
        .max(100)
        .optional(),
    description: z.string()
        .max(500)
        .optional()
});

module.exports = { createProjectSchema, addMemberSchema, updateProjectSchema };
