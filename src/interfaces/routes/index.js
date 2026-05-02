const express = require('express');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const ticketRoutes = require('./ticket.routes');

// Montar las rutas
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
