//AUTHOR: Ahmet Koc
// tests/errorHandler.test.js
const { expect } = require('chai');
const { AppError, notFoundHandler, globalErrorHandler } = require('../middleware/errorHandler');

describe('Error Handler Middleware', () => {
  
  describe('AppError Class', () => {
    it('should create an operational error with correct properties', () => {
      const error = new AppError('Test error message', 400);
      
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('Test error message');
      expect(error.statusCode).to.equal(400);
      expect(error.isOperational).to.be.true;
    });

    it('should capture stack trace', () => {
      const error = new AppError('Test error', 500);
      
      expect(error.stack).to.exist;
      expect(error.stack).to.be.a('string');
    });
  });

  describe('404 Not Found Handler', () => {
    it('should return 404 status and error message', () => {
      const req = {
        originalUrl: '/nonexistent-route',
        method: 'GET',
        ip: '127.0.0.1'
      };
      
      const res = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.body = data;
          return this;
        }
      };

      notFoundHandler(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body.message).to.include('Route not found');
    });
  });

  describe('Global Error Handler', () => {
  
  // Store original console.error
  let originalConsoleError;
  
  before(() => {
    // Silence console.error during tests
    originalConsoleError = console.error;
    console.error = () => {};
  });
  
  after(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('should handle operational errors correctly in development', (done) => {
    process.env.NODE_ENV = 'development';
    
    const err = new AppError('Operational error', 400);
    const req = { originalUrl: '/test', ip: '127.0.0.1' };
    
    let statusCode;
    let responseBody;
    
    const res = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      json: function(data) {
        responseBody = data;
        return this;
      }
    };
    
    const next = () => {};

    // Call the error handler
    try {
      globalErrorHandler(err, req, res, next);
      
      // Assertions
      expect(statusCode).to.equal(400);
      expect(responseBody).to.exist;
      expect(responseBody).to.have.property('message', 'Operational error');
      expect(responseBody).to.have.property('status', 'error');
      expect(responseBody).to.have.property('stack');
      
      done();
    } catch (error) {
      done(error);
    }
  });

  it('should hide error details in production for non-operational errors', (done) => {
    process.env.NODE_ENV = 'production';
    
    const err = new Error('Programming error');
    err.statusCode = 500;
    err.isOperational = false;
    
    const req = { originalUrl: '/test', ip: '127.0.0.1' };
    
    let statusCode;
    let responseBody;
    
    const res = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      json: function(data) {
        responseBody = data;
        return this;
      }
    };
    
    const next = () => {};

    // Call the error handler
    try {
      globalErrorHandler(err, req, res, next);
      
      // Assertions
      expect(statusCode).to.equal(500);
      expect(responseBody).to.exist;
      expect(responseBody.message).to.equal('Something went wrong. Please try again later.');
      expect(responseBody).to.not.have.property('stack');
      
      done();
    } catch (error) {
      done(error);
    }
  });

  it('should handle operational errors in production mode', (done) => {
    process.env.NODE_ENV = 'production';
    
    const err = new AppError('User not found', 404);
    const req = { originalUrl: '/users/999', ip: '127.0.0.1' };
    
    let statusCode;
    let responseBody;
    
    const res = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      json: function(data) {
        responseBody = data;
        return this;
      }
    };
    
    const next = () => {};

    try {
      globalErrorHandler(err, req, res, next);
      
      expect(statusCode).to.equal(404);
      expect(responseBody).to.have.property('message', 'User not found');
      expect(responseBody).to.not.have.property('stack');
      
      done();
    } catch (error) {
      done(error);
    }
  });

});

});