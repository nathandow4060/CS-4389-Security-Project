# Test Environment Plan - Sprint 4
## Security Testing for CS4389 Class Project

**Date:** November 13, 2025  
**Project:** GameVault PC Game Store  
**Team:** Security Team  

---

## 1. Test Environment Setup

### What You Need

**Software:**
- Node.js v22.17.0
- PostgreSQL 14.x
- Browser (Chrome/Firefox)
- Terminal

**How to Start:**
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd ../
npm run dev
```

**Check it works:**
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Database: Connected to cs4389_webstore

---

## 2. What We're Testing

### OWASP Top 10 Coverage (Class Requirement)

| OWASP | What We Test | How We Protect |
|-------|--------------|----------------|
| **A01 - Broken Access Control** | Can users access other users' data? | JWT authentication, authorization checks |
| **A02 - Cryptographic Failures** | Are passwords secure? | bcrypt hashing (10 rounds) |
| **A03 - Injection** | SQL injection, XSS attacks | Input validation, RASP detection, parameterized queries |
| **A04 - Insecure Design** | Security headers present? | Helmet middleware, CSP rules |
| **A05 - Security Misconfiguration** | Error messages leak info? | Generic errors in production, logging |
| **A07 - Authentication Failures** | Weak passwords allowed? | Password validation, JWT expiration |

---

## 3. Simple Security Tests

### Test 1: SQL Injection Protection

**What:** Try to inject SQL code into product ID

**Command:**
```bash
curl "http://localhost:3000/products/1' OR '1'='1"
```

**Expected:** Should return 400 Bad Request (blocked by validation)

**Result:** ✅ PASS / ❌ FAIL

---

### Test 2: XSS Protection

**What:** Try to inject JavaScript into forms

**Command:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"<script>alert(\"XSS\")</script>","password":"Test123!"}'
```

**Expected:** Input should be sanitized or rejected

**Result:** ✅ PASS / ❌ FAIL

---

### Test 3: Password Hashing

**What:** Check if passwords are hashed in database

**Command:**
```bash
psql -U admin -d cs4389_webstore -c "SELECT username, password FROM account LIMIT 3;"
```

**Expected:** Passwords should look like: `$2b$10$...` (bcrypt hash), NOT plain text

**Result:** ✅ PASS / ❌ FAIL

---

### Test 4: Security Headers

**What:** Check if security headers are present

**Command:**
```bash
curl -I http://localhost:3000/
```

**Expected:** Should see these headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy: ...`

**Result:** ✅ PASS / ❌ FAIL

---

### Test 5: Weak Password Rejection

**What:** Try to register with weak password

**Command:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'
```

**Expected:** Should return 400 Bad Request with error message

**Result:** ✅ PASS / ❌ FAIL

---

### Test 6: RASP Attack Detection

**What:** Check if RASP logs attacks

**Command:**
```bash
# Send attack attempt
curl "http://localhost:3000/products/1' OR '1'='1"

# Check security stats
curl http://localhost:3000/api/security/stats
```

**Expected:** Attack should be logged, stats should show suspicious activity

**Result:** ✅ PASS / ❌ FAIL

---

### Test 7: Authentication Required

**What:** Try to access protected route without login

**Command:**
```bash
curl http://localhost:3000/api/user/profile
```

**Expected:** Should return 401 Unauthorized

**Result:** ✅ PASS / ❌ FAIL

---

### Test 8: Input Validation (Frontend)

**What:** Test frontend validation

**Steps:**
1. Open browser: http://localhost:5173
2. Find any form (login/register)
3. Try to submit with:
   - Empty fields
   - Invalid email (test@test)
   - Short password (123)
   - Special characters (`<script>`)

**Expected:** Form should not submit, show error messages

**Result:** ✅ PASS / ❌ FAIL

---

## 4. Test Results Summary

### Our Security Features

**✅ Implemented:**
- Helmet security headers (S3)
- RASP runtime protection (S4)
- Input validation frontend (F11)
- Password hashing with bcrypt
- JWT authentication
- Error handling & logging
- Parameterized SQL queries

**📊 Test Coverage:**
- Backend: 20 unit tests
- Frontend: 16 validation tests
- Manual security tests: 8 test cases

---

## 5. How we will Show This Works (For Class Demo)

### Demo Script

**1. Show Security Headers (30 seconds)**
```bash
curl -I http://localhost:3000/
```
Point out: X-Frame-Options, Content-Security-Policy, etc.

**2. Show SQL Injection Protection (1 minute)**
```bash
# Attack attempt
curl "http://localhost:3000/products/1' OR '1'='1"

# Show it's blocked
# Show RASP logs it
```

**3. Show Password Hashing (30 seconds)**
```bash
psql -U admin -d cs4389_webstore -c "SELECT username, password FROM account LIMIT 2;"
```
Point out: Passwords are hashed, not plain text

**4. Show Input Validation (1 minute)**
- Open frontend
- Try to submit form with `<script>alert('XSS')</script>`
- Show it gets rejected

**5. Show RASP Detection (1 minute)**
```bash
curl http://localhost:3000/api/security/stats
```
Show blocked IPs and suspicious activity

**Total demo time: 4 minutes**

---

## 6. What We Learned (For Report)

**Security Concepts Implemented:**
1. **Defense in Depth** - Multiple layers of security
2. **Input Validation** - Never trust user input
3. **Secure Password Storage** - Always hash passwords
4. **Security Headers** - Browser-level protection
5. **Runtime Protection** - Detect attacks in real-time
6. **Least Privilege** - Users only access their own data

**OWASP Top 10 Coverage:**
- A01: JWT authorization ✅
- A02: bcrypt password hashing ✅
- A03: SQL injection & XSS prevention ✅
- A04: Helmet security headers ✅
- A05: Generic error messages ✅
- A07: Strong password requirements ✅

---

## 7. Files to Show 

**Code Files:**
- `backend/middleware/raspSecurity.js` - RASP protection
- `backend/middleware/errorHandler.js` - Error handling
- `backend/middleware/logger.js` - Security logging
- `backend/server.js` - Helmet integration
- `src/utils/validation.js` - Input validation

**Documentation:**
- `backend/docs/SECURITY_HEADERS.md` - Helmet explanation
- `backend/docs/RASP_SECURITY.md` - RASP explanation
- `backend/docs/TEST_ENVIRONMENT_PLAN.md` - This file

**Test Files:**
- `backend/tests/*.test.js` - 20 backend tests
- `src/utils/validation.test.js` - 16 validation tests

---

**END OF TEST PLAN**

*This plan demonstrates our understanding of OWASP Top 10 and secure coding practices for CS4389.*