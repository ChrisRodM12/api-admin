// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post('/register', validationMiddleware.validateRegistration, authController.register);
router.post('/login', validationMiddleware.validateLogin, authController.login);

module.exports = router;