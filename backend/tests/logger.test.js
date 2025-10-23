// tests/logger.test.js
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { securityLogger } = require('../middleware/logger');

describe('Logger Middleware', () => {
  
  const testLogsDir = path.join(__dirname, '../logs');
  const accessLogPath = path.join(testLogsDir, 'access.log');
  const errorLogPath = path.join(testLogsDir, 'error.log');

  describe('Security Logger', () => {
    
    before(() => {
      // Ensure logs directory exists
      if (!fs.existsSync(testLogsDir)) {
        fs.mkdirSync(testLogsDir);
      }
    });

    it('should log info messages to access.log', () => {
      const testMessage = 'Test info message for QA';
      
      // Get initial log size
      let initialSize = 0;
      if (fs.existsSync(accessLogPath)) {
        initialSize = fs.statSync(accessLogPath).size;
      }

      // Log message
      securityLogger(testMessage, 'info');

      // Check log file was updated
      const newSize = fs.statSync(accessLogPath).size;
      expect(newSize).to.be.greaterThan(initialSize);

      // Read log file and verify message
      const logContent = fs.readFileSync(accessLogPath, 'utf8');
      expect(logContent).to.include(testMessage);
      expect(logContent).to.include('[INFO]');
    });

    it('should log error messages to error.log', () => {
      const testMessage = 'Test error message for QA';
      
      // Get initial log size
      let initialSize = 0;
      if (fs.existsSync(errorLogPath)) {
        initialSize = fs.statSync(errorLogPath).size;
      }

      // Log error
      securityLogger(testMessage, 'error');

      // Check log file was updated
      const newSize = fs.statSync(errorLogPath).size;
      expect(newSize).to.be.greaterThan(initialSize);

      // Read log file and verify message
      const logContent = fs.readFileSync(errorLogPath, 'utf8');
      expect(logContent).to.include(testMessage);
      expect(logContent).to.include('[ERROR]');
    });

    it('should include timestamp in log entries', () => {
      const testMessage = 'Test timestamp message';
      
      securityLogger(testMessage, 'info');

      const logContent = fs.readFileSync(accessLogPath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.includes(testMessage));
      
      expect(logLines.length).to.be.greaterThan(0);
      // Check for ISO timestamp format
      expect(logLines[0]).to.match(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    it('should handle warning level correctly', () => {
      const testMessage = 'Test warning message';
      
      securityLogger(testMessage, 'warning');

      const logContent = fs.readFileSync(errorLogPath, 'utf8');
      expect(logContent).to.include(testMessage);
      expect(logContent).to.include('[WARNING]');
    });

  });

  describe('Request Logger Middleware', () => {
    
    it('should exist and be a function', () => {
      const { requestLogger } = require('../middleware/logger');
      expect(requestLogger).to.be.a('function');
    });

  });

});