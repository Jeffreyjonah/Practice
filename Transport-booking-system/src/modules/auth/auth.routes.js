const Router = require("express");
const { signUp } = require("./auth.register");
const {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  me,
} = require("./auth.controller");
const authMiddleware = require("../../middleware/authMiddleware");

const route = Router();

route.post('/signup', signUp);
route.post('/login', login);
route.post('/forgot-password', forgotPassword);
route.post('/reset-password', resetPassword);
route.post('/refresh-token', refreshToken);
route.post('/logout', logout);

route.get('/me', authMiddleware, me);

module.exports = route;