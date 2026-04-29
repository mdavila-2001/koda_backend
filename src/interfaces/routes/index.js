const express = require('express');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./auth.routes');
// const projectRoutes = require('./project.routes'); // Lo descomentarás cuando lo crees
// const ticketRoutes = require('./ticket.routes');   // Lo descomentarás cuando lo crees

// Montar las rutas
router.use('/auth', authRoutes);
// router.use('/projects', projectRoutes);
// router.use('/tickets', ticketRoutes);

module.exports = router;
