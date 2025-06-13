// models/Role.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {});

  Role.associate = function(models) {
    // Asociación uno a muchos: Un rol puede tener muchos usuarios
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users'
    });
  };
  return Role;
};