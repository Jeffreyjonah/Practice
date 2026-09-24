const AppError = require('../utils/appError');

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  let error = err;

  // Malformed JSON body comes in as a SyntaxError from express.json()
  if (err.type === 'entity.parse.failed') {
    error = new AppError('Malformed JSON in request body', 400);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token has expired', 401);
  }

  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;

  if (!isOperational) {
    // Programmer/unexpected error — log full detail internally, hide it from the client
    console.error('UNEXPECTED ERROR', err);
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational
      ? error.message
      : 'Something went wrong',
    statusCode,
  });
}

module.exports = { notFound, errorHandler };