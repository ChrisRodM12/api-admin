// middleware/roleMiddleware.js
const AppError = require('../utils/AppError');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.role.name)) {
      return next(new AppError('No tienes permiso para realizar esta acción.', 403));
    }
    next();
  };
};