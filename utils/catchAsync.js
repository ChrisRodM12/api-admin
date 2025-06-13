// utils/catchAsync.js
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Pasa el error al siguiente middleware de error
  };
};