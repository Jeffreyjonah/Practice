const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { jwtSecret } = require('../config/env');
const { readDB } = require('../utils/db');

const authMiddleware = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('You are not logged in. Please log in to access this resource.', 401);
  }

  const token = authHeader.split(' ')[1];

  // jwt.verify throws JsonWebTokenError/TokenExpiredError — caught by
  // catchAsync and translated by your errorMiddleware.
  const decoded = jwt.verify(token, jwtSecret);

  const db = await readDB();
  const currentUser = db.users.find((u) => u.id === decoded.id);

  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  req.user = currentUser;
  next();
});

module.exports = authMiddleware;