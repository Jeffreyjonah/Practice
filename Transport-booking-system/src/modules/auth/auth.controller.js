const catchAsync = require('../../utils/catchAsync');
const authService = require('./auth.service');

const isWeb = (req) => req.headers['x-client-type'] === 'web';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  if (isWeb(req)) {
    res.cookie('refreshToken', refreshToken, cookieOptions);
    return res.status(200).json({
      success: true,
      accessToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  }

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(token);
  res.status(200).json({ success: true, accessToken });
});

const logout = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logout(token);
  if (isWeb(req)) res.clearCookie('refreshToken', cookieOptions);
  res.status(200).json({ success: true, message: 'Logged out' });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetToken = await authService.forgotPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: 'If that email exists, a reset link was sent.',
    resetToken,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.status(200).json({ success: true, message: 'Password reset successful' });
});

const me = catchAsync(async (req, res) => {
  const { id, name, email, role, createdAt } = req.user;
  res.status(200).json({ success: true, user: { id, name, email, role, createdAt } });
});

module.exports = { login, refreshToken, logout, forgotPassword, resetPassword, me };