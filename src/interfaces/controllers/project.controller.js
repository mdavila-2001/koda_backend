const PostgresProjectRepository = require('../../infrastructure/repositories/postgresproject.repository');
const PostgresUserRepository = require('../../infrastructure/repositories/postgresuser.repository');
const CreateProject = require('../../application/use-cases/project/createProject');
const GetProjects = require('../../application/use-cases/project/getProjects');
const GetProjectDetails = require('../../application/use-cases/project/getProjectDetails');
const AddProjectMember = require('../../application/use-cases/project/addProjectMember');
const GetProjectMembersList = require('../../application/use-cases/project/getProjectMembersList');

// Manual Dependency Injection
const projectRepository = new PostgresProjectRepository();
const userRepository = new PostgresUserRepository();
const createProjectUseCase = new CreateProject(projectRepository);
const getProjectsUseCase = new GetProjects(projectRepository);
const getProjectDetailsUseCase = new GetProjectDetails(projectRepository);
const addProjectMemberUseCase = new AddProjectMember(projectRepository, userRepository);
const getProjectMembersListUseCase = new GetProjectMembersList(projectRepository);

class ProjectController {
    async create(req, res, next) {
        try {
            const { name, description } = req.body;
            const owner_id = req.userId; // Extracted by isAuth middleware

            const newProject = await createProjectUseCase.execute({ name, description, owner_id });
            
            res.status(201).json({
                status: 'success',
                data: newProject
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const userId = req.userId;
            const projects = await getProjectsUseCase.execute(userId);
            
            res.status(200).json({
                status: 'success',
                data: projects
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const userId = req.userId;
            const projectId = req.params.id;
            const project = await getProjectDetailsUseCase.execute(projectId, userId);
            
            res.status(200).json({
                status: 'success',
                data: project
            });
        } catch (error) {
            next(error);
        }
    }

    async addMember(req, res, next) {
        try {
            const ownerId = req.userId;
            const projectId = req.params.id;
            const { email } = req.body;

            const result = await addProjectMemberUseCase.execute(projectId, ownerId, email);
            
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getMembersList(req, res, next) {
        try {
            const userId = req.userId;
            const projectId = req.params.id;

            const members = await getProjectMembersListUseCase.execute(projectId, userId);
            
            res.status(200).json({
                status: 'success',
                data: members
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProjectController();
