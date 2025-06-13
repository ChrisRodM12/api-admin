// controllers/authController.js
const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const { user, token } = await authService.register(username, email, password);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId
      },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId
      },
    },
  });
});