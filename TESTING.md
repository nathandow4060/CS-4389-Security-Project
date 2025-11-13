# Testing Guide - GameVault Security Project

## Overview

This project uses different testing frameworks for frontend and backend:
- **Backend:** Mocha + Chai + Supertest
- **Frontend:** Vitest + React Testing Library

---

## Running Tests

### Run All Tests (Backend + Frontend)
```bash
npm run test:all
```

### Run Frontend Tests Only
```bash
npm run test:frontend
```

### Run Backend Tests Only
```bash
npm run test:backend
```

Or navigate to backend folder:
```bash
cd backend
npm test
```

---

## Backend Testing

### Test Structure

Tests are located in `backend/tests/` folder:
- `errorHandler.test.js` - Error handling middleware tests (6 tests)
- `logger.test.js` - Logging middleware tests (5 tests)
- `server.test.js` - API integration tests (4 tests)
- `products.test.js` - API endpoint tests for products (5 tests)


### Backend Test Results

All 20 backend tests passing:
- Error Handler Middleware: 6 passing
- Logger Middleware: 5 passing
- Server API Integration: 4 passing
- Products API endpoints: 5 passing

### Writing New Backend Tests
```javascript
const { expect } = require('chai');

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).to.equal('expected output');
  });
});
```

---

## Frontend Testing

### Test Structure

Tests are located in `src/__tests__/` folder:
- `App.test.jsx` - Main App component tests (4 tests)

### Frontend Test Results

All 4 frontend tests passing:
- App Component: 4 passing

### Writing New Frontend Tests
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Component from '../Component';

describe('Component Name', () => {
  it('should render correctly', () => {
    render(<Component />);
    const element = screen.getByText(/expected text/i);
    expect(element).toBeDefined();
  });
});
```

---

## Security Testing Coverage

### What's Tested

1. **Error Handling:**
   - AppError class creation
   - 404 Not Found handler
   - Global error handler (dev vs production)
   - Information disclosure prevention
   - Stack trace handling

2. **Logging:**
   - Security logger functionality
   - Access log creation
   - Error log creation
   - Timestamp formatting
   - Log level handling (info, warning, error)

3. **Server Integration:**
   - Root endpoint
   - Hello World route
   - 404 error handling
   - 400 error handling

4. **Frontend Components:**
   - App rendering
   - UI element presence
   - Button functionality
   - Styling validation

---

## Manual Security Testing

### Test Endpoints
```bash
# Start the backend server
cd backend
npm run devstart

# In another terminal:

# Test root endpoint
curl http://localhost:3000/

# Test 404 handler
curl http://localhost:3000/nonexistent

# Test 400 error
curl http://localhost:3000/test-error

# Test 500 error
curl http://localhost:3000/test-crash

# Check logs
cat backend/logs/access.log
cat backend/logs/error.log
```

---

## Test Coverage Goals

- **Backend:** 80% minimum (currently focused on security middleware)
- **Frontend:** 70% minimum (currently basic component coverage)
- **Security Features:** 100% coverage required

---

## Troubleshooting

### Backend Tests Failing

**Issue:** "Cannot find module"
```bash
cd backend
npm install
```

**Issue:** "Timeout error"
- Increase timeout in test file or check async operations

### Frontend Tests Failing

**Issue:** "Cannot find vitest"
```bash
npm install
```

**Issue:** "Tests running backend files"
- Check vitest.config.js excludes backend folder

---

## Pre-Commit Checklist

Before committing code:
- [ ] Run `npm run test:all` - all tests pass
- [ ] Check `backend/logs/` not committed
- [ ] Check `.env` not committed
- [ ] Run `npm run lint` if available

---

## Continuous Integration

When setting up CI/CD:
```yaml
# Example GitHub Actions workflow
- name: Test Backend
  run: |
    cd backend
    npm install
    npm test

- name: Test Frontend
  run: |
    npm install
    npm run test:frontend
```

---

## Resources

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)