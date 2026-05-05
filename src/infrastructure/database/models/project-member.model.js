const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ProjectMember = sequelize.define('ProjectMember', {
    projectId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'project_id',
        references: {
            model: 'projects',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    joinedAt: {
        type: DataTypes.DATE,
        field: 'joined_at',
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'project_members',
    timestamps: false
});

module.exports = ProjectMember;
