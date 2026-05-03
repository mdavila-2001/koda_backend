const db = require('../database/db');
const ProjectRepository = require('../../application/repositories/project.repository');

class PostgresProjectRepository extends ProjectRepository {
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

  async update(projectId, updateData) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    values.push(projectId);

    const { rows } = await db.query(query, values);
    return rows[0] || null;
  }
}

module.exports = PostgresProjectRepository;
