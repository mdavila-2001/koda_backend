const { z } = require('zod');

const registerSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100),
  email: z.string()
    .email({ message: "Formato de correo electrónico inválido" }),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
});

const loginSchema = z.object({
    email: z.string().email({ message: "Formato de correo electrónico inválido" }),
    password: z.string().min(1, "La contraseña es obligatoria")
});

module.exports = { registerSchema, loginSchema };
