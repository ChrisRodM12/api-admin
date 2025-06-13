// controllers/errorController.js
const AppError = require('../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errors[0].message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]; // Extrae el valor duplicado
  const message = `Valor de campo duplicado: ${value}. Por favor, usa otro valor.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Datos de entrada inválidos. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Token inválido. Por favor, inicia sesión de nuevo.', 401);

const handleJWTExpiredError = () => new AppError('Tu token ha expirado. Por favor, inicia sesión de nuevo.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Errores operacionales, de confianza: envía el mensaje al cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  // Errores de programación o desconocidos: no se filtra información del error
  } else {
    // 1) Log del error
    console.error('ERROR 💥', err);

    // 2) Enviar mensaje genérico
    res.status(500).json({
      status: 'error',
      message: '¡Algo salió muy mal!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message; // Para que el spread no pierda el mensaje

    if (error.name === 'SequelizeDatabaseError') error = handleCastErrorDB(error); // Ejemplo, adaptar
    if (error.name === 'SequelizeUniqueConstraintError') error = handleDuplicateFieldsDB(error);
    if (error.name === 'SequelizeValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};