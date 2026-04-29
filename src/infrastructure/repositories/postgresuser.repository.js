const db = require('../database/db');

class PostgresUserRepository {
  async findByEmail(email) {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    return rows[0];
  }

  async create(user) {
    const { name, email, password } = user;
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password]
    );
    return rows[0];
  }
}

module.exports = PostgresUserRepository;