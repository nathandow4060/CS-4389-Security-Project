// middleware/raspSecurity.js
// Runtime Application Self-Protection (RASP) - Security Monitoring

const { securityLogger } = require('./logger');

// Track failed attempts per IP
const failedAttempts = new Map();
const blockedIPs = new Set();

// Attack pattern detection
const ATTACK_PATTERNS = {
  sqlInjection: /'|--|;|\/\*|\*\/|xp_|sp_|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER/gi,
  xss: /<script|javascript:|onerror=|onload=|<iframe|eval\(|expression\(/gi,
  pathTraversal: /\.\.\//g,
  commandInjection: /;|\||&|`|\$\(|>\||<\|/g,
};

// Configuration
const CONFIG = {
  maxFailedAttempts: 5,
  blockDuration: 15 * 60 * 1000, // 15 minutes
  suspiciousThreshold: 3,
  resetInterval: 60 * 1000, // 1 minute
};

/**
 * Check if IP is blocked
 */
const isIPBlocked = (ip) => {
  return blockedIPs.has(ip);
};

/**
 * Block an IP address
 */
const blockIP = (ip, reason) => {
  blockedIPs.add(ip);
  securityLogger(
    `BLOCKED IP: ${ip} - Reason: ${reason}`,
    'error'
  );

  // Auto-unblock after duration
  setTimeout(() => {
    blockedIPs.delete(ip);
    securityLogger(`✅ UNBLOCKED IP: ${ip}`, 'info');
  }, CONFIG.blockDuration);
};

/**
 * Track failed attempt
 */
const trackFailedAttempt = (ip, type) => {
  if (!failedAttempts.has(ip)) {
    failedAttempts.set(ip, { count: 0, types: [] });
  }

  const record = failedAttempts.get(ip);
  record.count++;
  record.types.push(type);

  if (record.count >= CONFIG.maxFailedAttempts) {
    blockIP(ip, `Too many failed attempts (${record.count})`);
  }

  return record.count;
};

/**
 * Detect SQL Injection attempts
 */
const detectSQLInjection = (input) => {
  if (typeof input !== 'string') return false;
  return ATTACK_PATTERNS.sqlInjection.test(input);
};

/**
 * Detect XSS attempts
 */
const detectXSS = (input) => {
  if (typeof input !== 'string') return false;
  return ATTACK_PATTERNS.xss.test(input);
};

/**
 * Detect Path Traversal attempts
 */
const detectPathTraversal = (input) => {
  if (typeof input !== 'string') return false;
  return ATTACK_PATTERNS.pathTraversal.test(input);
};

/**
 * Detect Command Injection attempts
 */
const detectCommandInjection = (input) => {
  if (typeof input !== 'string') return false;
  return ATTACK_PATTERNS.commandInjection.test(input);
};

/**
 * Analyze request for security threats
 */
const analyzeRequest = (req) => {
  const threats = [];
  const ip = req.ip || req.connection.remoteAddress;

  // Check URL parameters
  const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
  for (const [key, value] of urlParams) {
    if (detectSQLInjection(value)) {
      threats.push({ type: 'SQL_INJECTION', location: 'URL_PARAM', key, value });
    }
    if (detectXSS(value)) {
      threats.push({ type: 'XSS', location: 'URL_PARAM', key, value });
    }
    if (detectPathTraversal(value)) {
      threats.push({ type: 'PATH_TRAVERSAL', location: 'URL_PARAM', key, value });
    }
  }

  // Check request body
  if (req.body && typeof req.body === 'object') {
    Object.entries(req.body).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (detectSQLInjection(value)) {
          threats.push({ type: 'SQL_INJECTION', location: 'BODY', key });
        }
        if (detectXSS(value)) {
          threats.push({ type: 'XSS', location: 'BODY', key });
        }
        if (detectCommandInjection(value)) {
          threats.push({ type: 'COMMAND_INJECTION', location: 'BODY', key });
        }
      }
    });
  }

  // Check headers
  const suspiciousHeaders = ['x-forwarded-for', 'user-agent', 'referer'];
  suspiciousHeaders.forEach((header) => {
    const value = req.headers[header];
    if (value && detectXSS(value)) {
      threats.push({ type: 'XSS', location: 'HEADER', key: header });
    }
  });

  return threats;
};

/**
 * RASP Middleware - Main security monitor
 */
const raspMiddleware = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;

  // Check if IP is blocked
  if (isIPBlocked(ip)) {
    securityLogger(
      `BLOCKED REQUEST: ${ip} attempted to access ${method} ${url}`,
      'warning'
    );
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Your IP has been temporarily blocked due to suspicious activity.',
    });
  }

  // Analyze request for threats
  const threats = analyzeRequest(req);

  if (threats.length > 0) {
    // Log detected threats
    securityLogger(
      `ATTACK DETECTED: ${ip} - ${method} ${url}\n` +
      `Threats: ${threats.map(t => `${t.type} in ${t.location}`).join(', ')}\n` +
      `Details: ${JSON.stringify(threats)}`,
      'error'
    );

    // Track attempt
    const attemptCount = trackFailedAttempt(ip, threats[0].type);

    // High severity - block immediately
    if (threats.length >= CONFIG.suspiciousThreshold) {
      blockIP(ip, `Multiple attack patterns detected (${threats.length})`);
      return res.status(403).json({
        status: 'error',
        message: 'Request blocked due to suspicious activity.',
      });
    }

    // Medium severity - warn but allow (for now)
    securityLogger(
      `WARNING: ${ip} has ${attemptCount} failed attempts`,
      'warning'
    );
  }

  // Continue to next middleware
  next();
};

/**
 * Get security statistics
 */
const getSecurityStats = () => {
  return {
    blockedIPs: Array.from(blockedIPs),
    suspiciousIPs: Array.from(failedAttempts.entries()).map(([ip, data]) => ({
      ip,
      attempts: data.count,
      types: data.types,
    })),
    totalBlocked: blockedIPs.size,
    totalSuspicious: failedAttempts.size,
  };
};

/**
 * Reset failed attempts periodically
 */
setInterval(() => {
  failedAttempts.clear();
  securityLogger('RASP: Cleared failed attempts tracker', 'info');
}, CONFIG.resetInterval);

module.exports = {
  raspMiddleware,
  getSecurityStats,
  isIPBlocked,
  blockIP,
  detectSQLInjection,
  detectXSS,
  detectPathTraversal,
  detectCommandInjection,
};