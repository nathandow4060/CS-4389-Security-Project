// tests/products.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Products API Endpoints', () => {

  describe('GET /products', () => {
    it('should return all products with 200 status', (done) => {
      request(app)
        .get('/products')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('should return products with correct structure', (done) => {
      request(app)
        .get('/products')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const products = res.body.data;
          if (products.length > 0) {
            expect(products[0]).to.have.property('id');
            expect(products[0]).to.have.property('name_of_product');
            expect(products[0]).to.have.property('price');
          }
          done();
        });
    });
  });

  describe('GET /products/:id', () => {
    it('should return specific product by id', (done) => {
      request(app)
        .get('/products/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('id');
          expect(Number(res.body.data.id)).to.equal(1);
          done();
        });
    });

    it('should return 400 for invalid product id', (done) => {
      request(app)
        .get('/products/abc')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Invalid product id');
          done();
        });
    });

    it('should return 404 for non-existent product', (done) => {
      request(app)
        .get('/products/99999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Product not found');
          done();
        });
    });
  });

});