const { Project, ProjectMember, User } = require('../database/models');
const { Op } = require('sequelize');
const ProjectRepository = require('../../application/repositories/project.repository');

class PostgresProjectRepository extends ProjectRepository {
  async create({ name, description, owner_id }) {
    const project = await Project.create({ name, description, ownerId: owner_id });
    return project.get({ plain: true });
  }

  async findByUserId(userId) {
    const projects = await Project.findAll({
      include: [{
        model: User,
        as: 'members',
        attributes: [],
        through: { attributes: [] },
        required: false,
        where: { id: userId }
      }],
      where: {
        [Op.or]: [
          { ownerId: userId },
          { '$members.id$': userId }
        ]
      },
      order: [['created_at', 'DESC']]
    });
    return projects.map(p => p.get({ plain: true }));
  }

  async findById(projectId, userId) {
    const project = await Project.findOne({
      include: [{
        model: User,
        as: 'members',
        attributes: [],
        through: { attributes: [] },
        required: false,
        where: { id: userId }
      }],
      where: {
        id: projectId,
        [Op.or]: [
          { ownerId: userId },
          { '$members.id$': userId }
        ]
      }
    });
    return project ? project.get({ plain: true }) : null;
  }

  async addMember(projectId, userId) {
    const member = await ProjectMember.findOrCreate({
      where: { projectId, userId }
    });
    return member[0].get({ plain: true });
  }

  async getProjectMembers(projectId) {
    const project = await Project.findByPk(projectId, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
      ]
    });

    if (!project) return [];

    const owner = project.owner.get({ plain: true });
    const members = project.members.map(m => m.get({ plain: true }));

    // Combine and remove duplicates (though owner might not be in members)
    const allMembers = [owner, ...members];
    const uniqueMembers = Array.from(new Map(allMembers.map(m => [m.id, m])).values());
    
    return uniqueMembers;
  }

  async update(projectId, updateData) {
    const [updatedCount, updatedProjects] = await Project.update(updateData, {
      where: { id: projectId },
      returning: true
    });
    return updatedCount > 0 ? updatedProjects[0].get({ plain: true }) : null;
  }
}

module.exports = PostgresProjectRepository;
