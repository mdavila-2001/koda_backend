const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const isAuth = require('../middleware/isAuth');
const validate = require('../middleware/validator');
const { createProjectSchema, addMemberSchema, updateProjectSchema } = require('../validators/project.validator');

// All project routes require authentication
router.use(isAuth);

router.post('/', validate(createProjectSchema), projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.get('/:id/members', projectController.getMembersList);
router.post('/:id/members', validate(addMemberSchema), projectController.addMember);
router.patch('/:id', validate(updateProjectSchema), projectController.update);

module.exports = router;
