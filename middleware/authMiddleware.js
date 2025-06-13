// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Obtener el token y verificar si existe
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No has iniciado sesión. Por favor, inicia sesión para obtener acceso.', 401));
  }

  // 2) Verificar el token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Verificar si el usuario aún existe
  const currentUser = await userRepository.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('El usuario al que pertenece este token ya no existe.', 401));
  }

  // 4) Otorgar acceso a la ruta protegida
  req.user = currentUser; // Guardamos el usuario en el objeto de solicitud
  next();
});