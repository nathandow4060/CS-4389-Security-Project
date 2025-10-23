// server.js - Updated with error handling and logging middleware
const express = require('express');
const dotenv = require('dotenv');

// Import middleware
const { devLogger, prodLogger, requestLogger } = require('./middleware/logger');
const { notFoundHandler, globalErrorHandler, AppError } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ===== MIDDLEWARE =====

// 1. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(devLogger); // Console logging with colors
} else {
  app.use(prodLogger); // File logging only
}
app.use(requestLogger); // Security logging for all requests

// ===== ROUTES =====

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'GameVault API - Server is running',
    timestamp: new Date().toISOString()
  });
});

// Existing route from Ethan
const helloworldRouter = require('./routes/helloworld');
app.use('/helloworld', helloworldRouter);

// Test routes for error handling
app.get('/test-error', (req, res, next) => {
  // Test operational error (400 Bad Request)
  next(new AppError('This is a test error - Bad Request', 400));
});

app.get('/test-crash', (req, res) => {
  // Test programming error (500 Internal Server Error)
  throw new Error('Simulated server crash for testing!');
});

// ===== ERROR HANDLING =====

// 404 Handler (must be after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be last middleware)
app.use(globalErrorHandler);

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`🚀 GameVault Server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Logging: ${process.env.NODE_ENV === 'development' ? 'Console + File' : 'File Only'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});