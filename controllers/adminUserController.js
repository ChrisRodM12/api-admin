// controllers/adminUserController.js
const adminUserService = require('../services/adminUserService');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await adminUserService.getAllUsers();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await adminUserService.getUserById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await adminUserService.updateUser(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await adminUserService.deleteUser(req.params.id);
  res.status(204).json({ // 204 No Content para eliminación exitosa
    status: 'success',
    data: null,
  });
});