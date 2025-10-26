// server.js - Updated with error handling and logging middleware
// Note for TEAM: launch with npm run devstart
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ===== IMPORT MIDDLEWARE =====
const { devLogger, prodLogger, requestLogger } = require('./backend/middleware/logger');
const { notFoundHandler, globalErrorHandler, AppError } = require('./backend/middleware/errorHandler');

// ===== IMPORT ROUTES =====
const helloworldRouter = require('./backend/routes/helloworld'); // ✅ matches your folder tree

// ===== INITIALIZE APP =====
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ===== CORE MIDDLEWARE =====

// 1. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //hook up front end API

// 2. Logging middleware
if (NODE_ENV === 'development') {
  app.use(devLogger); // Console logging with colors
  console.log('🛠 Development logging enabled');
} else {
  app.use(prodLogger); // File logging only
}
app.use(requestLogger); // Security logging for all requests

// ===== ROUTES =====

// Root API route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'GameVault API - Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Hello World route
app.use('/helloworld', helloworldRouter);

//Product Routes
const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

// Test routes for error handling
app.get('/test-error', (req, res, next) => {
  next(new AppError('This is a test error - Bad Request', 400));
});

// Test programming crash (500)
app.get('/test-crash', (req, res) => {
  throw new Error('Simulated server crash for testing!');
});

// ===== ERROR HANDLING =====

// 404 Handler (must come after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(globalErrorHandler);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 GameVault Server running on port ${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`📊 Logging Mode: ${NODE_ENV === 'development' ? 'Console + File' : 'File Only'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app;
