const User = require('./user.model');
const Project = require('./project.model');
const ProjectMember = require('./project-member.model');
const Ticket = require('./ticket.model');

// User - Project (Owner)
User.hasMany(Project, { foreignKey: 'owner_id', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// User - Project (Member)
User.belongsToMany(Project, { 
    through: ProjectMember, 
    foreignKey: 'user_id', 
    otherKey: 'project_id',
    as: 'memberProjects' 
});
Project.belongsToMany(User, { 
    through: ProjectMember, 
    foreignKey: 'project_id', 
    otherKey: 'user_id',
    as: 'members' 
});

// Project - Ticket
Project.hasMany(Ticket, { foreignKey: 'project_id', as: 'tickets' });
Ticket.belongsTo(Project, { foreignKey: 'project_id' });

// User - Ticket (Assignee)
User.hasMany(Ticket, { foreignKey: 'assigned_user_id', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assigned_user_id', as: 'assignee' });

module.exports = {
    User,
    Project,
    ProjectMember,
    Ticket
};
