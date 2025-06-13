// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_PASSWORD = process.env.DB_PASSWORD;
console.log('DEBUG: DB_PASSWORD loaded:', typeof DB_PASSWORD, DB_PASSWORD); 

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'api-admin-BD',
  logging: false, 
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }// Esto arreglará la advertencia de deprecaución
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
};

module.exports = sequelize;

module.exports = { sequelize, testConnection };


/*
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
8    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorageTableSchema: 'public',
    seederStorageTableSchema: 'public',
    logging: true, // Puedes cambiarlo a true para ver las queries SQL
  },
  test: {
    // Configuración para entorno de pruebas
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: 'public',
  },
  production: {
    // Configuración para producción (usar variables de entorno)
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: 'public',
  }
};
*/