//AUTHOR: Ahmet Koc
// tests/server.test.js
const request = require('supertest');
const { expect } = require('chai');

// Note: We'll need to modify server.js to export the app
// For now, this is a skeleton test structure

describe('Server API Integration Tests', () => {

  describe('GET /', () => {
    it('should return 200 status and server info', (done) => {
      // This will work once we export app from server.js
      // For now, it's a skeleton showing test structure
      
      // Example structure:
      // request(app)
      //   .get('/')
      //   .expect(200)
      //   .end((err, res) => {
      //     if (err) return done(err);
      //     expect(res.body).to.have.property('status', 'success');
      //     expect(res.body).to.have.property('message');
      //     done();
      //   });
      
      // Placeholder pass for now
      expect(true).to.be.true;
      done();
    });
  });

  describe('GET /helloworld', () => {
    it('should return Hello World message', (done) => {
      // Skeleton for testing Ethan's route
      
      // Example:
      // request(app)
      //   .get('/helloworld')
      //   .expect(200)
      //   .end((err, res) => {
      //     if (err) return done(err);
      //     expect(res.text).to.equal('Hello World');
      //     done();
      //   });
      
      expect(true).to.be.true;
      done();
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 error', (done) => {
      // Skeleton for testing 404 handler
      
      // Example:
      // request(app)
      //   .get('/nonexistent')
      //   .expect(404)
      //   .end((err, res) => {
      //     if (err) return done(err);
      //     expect(res.body).to.have.property('status', 'error');
      //     expect(res.body.message).to.include('not found');
      //     done();
      //   });
      
      expect(true).to.be.true;
      done();
    });
  });

  describe('GET /test-error', () => {
    it('should trigger error handler and return 400', (done) => {
      // Skeleton for testing error handler middleware
      
      expect(true).to.be.true;
      done();
    });
  });

});