// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

class AuthService {
  async register(username, email, password) {
    // Validar si el usuario o email ya existen
    if (await userRepository.findByUsername(username)) {
      throw new AppError('El nombre de usuario ya está en uso.', 400);
    }
    if (await userRepository.findByEmail(email)) {
      throw new AppError('El email ya está registrado.', 400);
    }

    // Obtener el rol 'user' por defecto
    const userRole = await roleRepository.findByName('user');
    if (!userRole) {
      throw new AppError('Rol "user" no encontrado. Contacte al administrador.', 500);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const newUser = await userRepository.create({
      username,
      email,
      password: hashedPassword,
      roleId: userRole.id,
    });

    // Generar token JWT
    const token = signToken(newUser.id);

    return { user: newUser, token };
  }

  async login(email, password) {
    // 1. Verificar si el usuario existe y la contraseña es correcta
    const user = await userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Email o contraseña incorrectos.', 401);
    }

    // 2. Generar token JWT
    const token = signToken(user.id);

    return { user, token };
  }
}

module.exports = new AuthService();