// server.js - Updated with error handling and logging middleware
// Note for TEAM: launch with npm run devstart
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.config();


// ===== IMPORT MIDDLEWARE =====
const { devLogger, prodLogger, requestLogger } = require('./middleware/logger');
const { notFoundHandler, globalErrorHandler, AppError } = require('./middleware/errorHandler');

// ===== IMPORT ROUTES =====

// ===== INITIALIZE APP =====
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Helmet - Core security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:5173"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5173"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for development
}));

// 2. Additional security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// ===== CORE MIDDLEWARE =====
const allowedOrigins = [
  "https://cs-4389-security-project-5itx3sd6g-nate-dows-projects.vercel.app/", // vercel app url in use
  "http://localhost:5173" // for local dev
];

// 1. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); //hook up front end API

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
