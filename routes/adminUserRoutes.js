// routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// Todas las rutas de administración requieren autenticación y rol de administrador
router.use(protect);
router.use(restrictTo('admin')); 

router.get('/', adminUserController.getAllUsers);

router.get('/:id', adminUserController.getUserById);
router.put('/:id', validationMiddleware.validateUserUpdate, adminUserController.updateUser);
router.delete('/:id', adminUserController.deleteUser);

module.exports = router;