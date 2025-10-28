// middleware/errorHandler.js
const { securityLogger } = require('./logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found Handler
const notFoundHandler = (req, res, next) => {
  const message = `Route not found: ${req.originalUrl}`;
  
  // Log 404 attempts (could indicate attack reconnaissance)
  securityLogger(
    `404 Not Found: ${req.method} ${req.originalUrl} from ${req.ip || req.connection.remoteAddress}`,
    'warning'
  );
  
  res.status(404).json({
    status: 'error',
    message: message
  });
};

// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Log the error with full details
  securityLogger(
    `ERROR: ${err.message}\nStack: ${err.stack}\nURL: ${req.originalUrl}\nIP: ${req.ip || req.connection.remoteAddress}`,
    'error'
  );
  
  // Send response based on environment
  if (process.env.NODE_ENV === 'development') {
    // Development: show full error details for debugging
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: hide sensitive details
    if (err.isOperational) {
      // Operational error: safe to send message
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming error: don't leak details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.',
      });
    }
  }
};

// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  notFoundHandler,
  globalErrorHandler,
  catchAsync
};