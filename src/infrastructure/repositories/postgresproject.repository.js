const db = require('../database/db');

class PostgresProjectRepository {
  async create({ name, description, owner_id }) {
    const { rows } = await db.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, owner_id]
    );
    return rows[0];
  }

  async findByUserId(userId) {
    const { rows } = await db.query(
      `SELECT DISTINCT p.* 
       FROM projects p
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE p.owner_id = $1 OR pm.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return rows;
  }

  async findById(projectId, userId) {
    const { rows } = await db.query(
      `SELECT DISTINCT p.* 
       FROM projects p
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE p.id = $1 AND (p.owner_id = $2 OR pm.user_id = $2)`,
      [projectId, userId]
    );
    return rows[0];
  }

  async addMember(projectId, userId) {
    const { rows } = await db.query(
      'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [projectId, userId]
    );
    return rows[0];
  }

  async getProjectMembers(projectId) {
    const { rows } = await db.query(
      `SELECT u.id, u.name, u.email 
       FROM users u 
       JOIN project_members pm ON u.id = pm.user_id 
       WHERE pm.project_id = $1
       UNION
       SELECT u.id, u.name, u.email 
       FROM users u 
       JOIN projects p ON u.id = p.owner_id 
       WHERE p.id = $1`,
      [projectId]
    );
    return rows;
  }
}

module.exports = PostgresProjectRepository;
