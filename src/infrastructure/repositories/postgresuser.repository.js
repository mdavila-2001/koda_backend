const { User } = require('../database/models');
const UserRepository = require('../../application/repositories/user.repository');

class PostgresUserRepository extends UserRepository {
  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user ? user.get({ plain: true }) : null;
  }

  async findById(id) {
    const user = await User.findByPk(id);
    return user ? user.get({ plain: true }) : null;
  }

  async create(userData) {
    const { name, email, password } = userData;
    const user = await User.create({ name, email, password });
    return user.get({ plain: true });
  }
}

module.exports = PostgresUserRepository;