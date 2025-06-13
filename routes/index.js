// routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const adminUserRoutes = require('./adminUserRoutes');

const app = express();


// Montar las rutas
router.use('/auth', authRoutes);
router.use('/admin/users', adminUserRoutes);

module.exports = router;
module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/admin/users', adminUserRoutes);
  // Aquí puedes agregar más rutas para productos, órdenes, etc.

};