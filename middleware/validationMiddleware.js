// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

exports.validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('El nombre de usuario debe tener al menos 3 caracteres.')
    .isAlphanumeric()
    .withMessage('El nombre de usuario solo puede contener letras y números.'),
  body('email')
    .isEmail()
    .withMessage('Por favor, ingresa un email válido.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número.')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula.'),
  body('passwordConfirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contraseñas no coinciden.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join('; '), 400));
    }
    next();
  }
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Por favor, ingresa un email válido.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join('; '), 400));
    }
    next();
  }
];

exports.validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Por favor, ingresa un email válido.')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número.')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula.'),
  body('roleName')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('El rol debe ser "admin" o "user".'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join('; '), 400));
    }
    next();
  }
];