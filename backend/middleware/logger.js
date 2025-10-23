// middleware/logger.js
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create write streams for different log files
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' } // append mode
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Development logging (console output with colors)
const devLogger = morgan('dev');

// Production logging (detailed file logging)
const prodLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
  { stream: accessLogStream }
);

// Security event logger function
const securityLogger = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  // Write to appropriate log file
  if (level === 'error' || level === 'warning') {
    fs.appendFileSync(path.join(logsDir, 'error.log'), logEntry);
  } else {
    fs.appendFileSync(path.join(logsDir, 'access.log'), logEntry);
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(logEntry.trim());
  }
};

// Request logging middleware with security info
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  securityLogger(
    `Request: ${req.method} ${req.originalUrl} from ${req.ip || req.connection.remoteAddress}`,
    'info'
  );
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warning' : 'info';
    
    securityLogger(
      `Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`,
      logLevel
    );
  });
  
  next();
};

module.exports = {
  devLogger,
  prodLogger,
  requestLogger,
  securityLogger
};