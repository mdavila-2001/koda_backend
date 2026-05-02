const { z } = require('zod');

const createProjectSchema = z.object({
    name: z.string()
        .min(3, "Project name must be at least 3 characters long")
        .max(100),
    description: z.string()
        .max(500)
        .optional()
});

const addMemberSchema = z.object({
    email: z.string().email("Invalid email format")
});

module.exports = { createProjectSchema, addMemberSchema };