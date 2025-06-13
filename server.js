// server.js
const app = require('./app');
const { sequelize } = require('./models'); // Importa la instancia de Sequelize

// Cargar variables de entorno
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y sincronizar modelos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    // No sincronizamos en producción para evitar problemas con migraciones
    // Si necesitas sincronizar tablas (NO RECOMENDADO EN PRODUCCIÓN)
    // return sequelize.sync({ alter: true }); // O { force: true } para recrear
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1); // Salir de la aplicación si hay un error de DB
  });

// Manejo de errores de procesos no capturados (ej: errores de promesa no manejados)
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando...');
  console.log(err.name, err.message);
  // Cerrar el servidor y luego salir del proceso
  server.close(() => {
    process.exit(1);
  });
});

// Manejo de errores de procesos no capturados (ej: variables no definidas)
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Cerrando...');
  console.log(err.name, err.message);
  process.exit(1);
});