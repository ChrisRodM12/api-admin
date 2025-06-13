// database/seeders/<timestamp>-add-admin-user.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero, obtenemos el ID del rol 'admin'
    const adminRole = await queryInterface.rawSelect('Roles', {
      where: {
        name: 'admin',
      },
    }, ['id']);

    if (!adminRole) {
      console.error("Error: Rol 'admin' no encontrado. Asegúrate de ejecutar la migración y el seeder de roles primero.");
      return;
    }

    const hashedPassword = await bcrypt.hash('AdminPassword123', 10); // Contraseña segura
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole, // Asignamos el ID del rol 'admin'
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};