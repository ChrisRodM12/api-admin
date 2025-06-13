// repositories/userRepository.js
const { User, Role } = require('../models'); // Importamos los modelos

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async findByUsername(username) {
    return User.findOne({ where: { username } });
  }

  async create(userData) {
    return User.create(userData);
  }

  async findAll() {
    return User.findAll({
      include: [{
        model: Role,
        as: 'role',
        attributes: ['name'] // Solo queremos el nombre del rol
      }],
      attributes: { exclude: ['password'] } // No retornar la contraseña
    });
  }

  async findById(id) {
    return User.findByPk(id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
  }

  async update(id, userData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(userData);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }
}

module.exports = new UserRepository(); // Exportamos una instancia