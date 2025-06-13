// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Errores esperados que podemos manejar

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;