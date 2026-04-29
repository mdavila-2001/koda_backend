const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const validate = require('../middleware/validator');
const { registerSchema } = require('../validators/auth.validator');

router.post('/register', validate(registerSchema), AuthController.register);

module.exports = router;