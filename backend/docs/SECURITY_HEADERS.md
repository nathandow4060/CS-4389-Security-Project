# Security Headers Documentation

This document explains the security headers implemented using Helmet.js middleware.

## Headers Implemented

### 1. Content-Security-Policy (CSP)
**Purpose:** Prevents Cross-Site Scripting (XSS) and data injection attacks

**Configuration:**
```javascript
defaultSrc: ["'self'"]                    // Only load resources from same origin
scriptSrc: ["'self'", "'unsafe-inline'"]  // Allow inline scripts (for development)
styleSrc: ["'self'", "'unsafe-inline'"]   // Allow inline styles
connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5173"]  // API calls
frameSrc: ["'none'"]                      // Block all iframes (prevents clickjacking)
objectSrc: ["'none'"]                     // Block plugins (Flash, Java)
```

**Security Benefits:**
- Blocks unauthorized scripts from running (XSS prevention)
- Prevents loading resources from malicious domains
- Stops clickjacking attacks via iframe blocking

---

### 2. X-Frame-Options: DENY
**Purpose:** Prevents clickjacking attacks

**What it does:**
- Prevents the site from being embedded in `<iframe>`, `<frame>`, or `<object>` tags
- Stops attackers from overlaying invisible frames to steal clicks

**OWASP Coverage:** A04 - Insecure Design

---

### 3. X-Content-Type-Options: nosniff
**Purpose:** Prevents MIME-sniffing attacks

**What it does:**
- Forces browsers to respect the declared Content-Type
- Prevents browsers from interpreting files as different types
- Stops attackers from uploading malicious files disguised as images

**Example Attack Prevented:**
- Attacker uploads `malicious.jpg` (actually a JavaScript file)
- Without this header: Browser executes it as JavaScript
- With this header: Browser refuses to execute it

---

### 4. X-XSS-Protection: 1; mode=block
**Purpose:** Legacy XSS protection for older browsers

**What it does:**
- Enables browser's built-in XSS filter
- Blocks page rendering if XSS detected
- Fallback for browsers that don't support CSP

**Note:** Modern browsers use CSP instead, but this provides backward compatibility

---

### 5. Referrer-Policy: strict-origin-when-cross-origin
**Purpose:** Controls how much referrer information is shared

**What it does:**
- Same-origin requests: Full URL sent
- Cross-origin requests: Only origin sent (no path/query)
- Prevents leaking sensitive data in URLs

**Example:**
- User visits: `https://gamevault.com/user/profile?id=123&token=abc`
- Clicks link to external site
- External site only sees: `https://gamevault.com` (not the token)

---

### 6. Permissions-Policy
**Purpose:** Restricts browser features

**Configuration:**
```
geolocation=()   // Block geolocation API
microphone=()    // Block microphone access
camera=()        // Block camera access
```

**Security Benefits:**
- Prevents malicious scripts from accessing device features
- Reduces privacy risks
- Minimizes attack surface

---

### 7. Strict-Transport-Security (HSTS)
**Purpose:** Forces HTTPS connections

**What it does:**
- Browser remembers to only use HTTPS
- Prevents protocol downgrade attacks
- Blocks man-in-the-middle attacks

**Note:** Only active in production (when `NODE_ENV=production`)

---

## Testing Security Headers

### Check all headers:
```bash
curl -I http://localhost:3000/
```

### Check specific header:
```bash
curl -I http://localhost:3000/ | grep "X-Frame-Options"
```

### Browser DevTools:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click any request
4. Check "Response Headers" section

---

## Security Benefits Summary

| Header | OWASP Coverage | Attack Prevented |
|--------|---------------|------------------|
| Content-Security-Policy | A03 - Injection | XSS attacks |
| X-Frame-Options | A04 - Insecure Design | Clickjacking |
| X-Content-Type-Options | A04 - Insecure Design | MIME sniffing |
| X-XSS-Protection | A03 - Injection | XSS (legacy) |
| Referrer-Policy | A01 - Broken Access Control | Info disclosure |
| Permissions-Policy | A04 - Insecure Design | Feature abuse |
| Strict-Transport-Security | A02 - Cryptographic Failures | MITM attacks |

---

## Production vs Development

**Development:**
- Allows `unsafe-inline` scripts/styles (for hot reload)
- Allows `http://localhost` connections
- Less strict CSP rules

**Production:**
- Removes `unsafe-inline` (strict CSP)
- Forces HTTPS with HSTS
- Enables `upgradeInsecureRequests`

To test production mode:
```bash
NODE_ENV=production npm start
```

---

## References

- [Helmet.js Documentation](https://helmetjs.github.io/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)