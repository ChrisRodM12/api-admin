// models/User.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2 // Por defecto, asignamos el rol 'user' (ID 2, lo veremos en seeders)
    }
  }, {});

  User.associate = function(models) {
    // Asociación muchos a uno: Un usuario pertenece a un rol
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role'
    });
  };
  return User;
};