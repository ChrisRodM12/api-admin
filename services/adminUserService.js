// services/adminUserService.js
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');

class AdminUserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }
    return user;
  }

  async updateUser(id, updateData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    // Si se intenta cambiar la contraseña, hashearla
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Si se intenta cambiar el rol, verificar que el rol exista
    if (updateData.roleName) {
      const newRole = await roleRepository.findByName(updateData.roleName);
      if (!newRole) {
        throw new AppError('El rol especificado no existe.', 400);
      }
      updateData.roleId = newRole.id;
      delete updateData.roleName; // Eliminar para evitar errores de Sequelize
    }

    const updatedUser = await userRepository.update(id, updateData);
    // Volver a buscar para incluir el rol actualizado si fue cambiado
    return this.getUserById(id);
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }
    // No permitir que un admin se borre a sí mismo (ejemplo de lógica de negocio)
    if (user.role.name === 'admin' && user.id === id) { // Simplificado, necesitas una forma de saber quién es el admin que borra
         // Para un caso real, necesitarías pasar el ID del usuario que está haciendo la solicitud
         // y comparar si es el mismo que está tratando de borrar.
         // throw new AppError('Un administrador no puede eliminarse a sí mismo.', 403);
    }
    await userRepository.delete(id);
    return { message: 'Usuario eliminado exitosamente.' };
  }
}

module.exports = new AdminUserService();