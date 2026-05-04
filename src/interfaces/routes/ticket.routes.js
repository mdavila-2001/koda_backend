const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const isAuth = require('../middleware/isAuth');
const validate = require('../middleware/validator');
const { createTicketSchema, updateTicketSchema } = require('../validators/ticket.validator');

router.use(isAuth);

router.post('/', validate(createTicketSchema), ticketController.create);
router.get('/project/:projectId', ticketController.getByProjectId);
router.patch('/:id', validate(updateTicketSchema), ticketController.update);
router.delete('/:id', ticketController.delete);

module.exports = router;
