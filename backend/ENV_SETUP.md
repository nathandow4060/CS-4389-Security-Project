# Environment Variables Setup Guide

## Quick Start

1. **Copy the template:**
```bash
   cp .env.example .env
```

2. **Generate secure secrets:**
```bash
   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # Generate SESSION_SECRET (run again for different value)
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. **Edit `.env` file:**
   - Replace `JWT_SECRET` with first generated string
   - Replace `SESSION_SECRET` with second generated string
   - Update `PGPASSWORD` if using different database credentials
   - Update `CORS_ORIGIN` if frontend runs on different port

4. **Never commit `.env` to Git!**
   - It's already in `.gitignore`
   - Only commit `.env.example`

---

## Environment Variables Explained

### Server Configuration
- **NODE_ENV**: `development` or `production`
- **PORT**: Server port (default: 3000)

### Database (PostgreSQL)
- **PGHOST**: Database host (default: localhost)
- **PGPORT**: Database port (default: 5432)
- **PGDATABASE**: Database name
- **PGUSER**: Database username
- **PGPASSWORD**: Database password (keep secret!)

### JWT (JSON Web Tokens)
- **JWT_SECRET**: Secret key for signing tokens (64+ char random string)
- **JWT_EXPIRES_IN**: Token expiration (e.g., 30d, 7h, 60m)
- **JWT_COOKIE_EXPIRES_IN**: Cookie expiration in days

### Session Management
- **SESSION_SECRET**: Secret for session cookies (64+ char random string)

### Security
- **BCRYPT_ROUNDS**: Password hashing cost (10-12 recommended, higher = slower but more secure)
- **CORS_ORIGIN**: Allowed frontend origin (React dev server URL)

### Rate Limiting (DDoS Protection)
- **RATE_LIMIT_WINDOW_MS**: Time window in milliseconds
- **RATE_LIMIT_MAX_REQUESTS**: Max requests per IP in window

---

## Security Best Practices

1. Use different secrets for JWT_SECRET and SESSION_SECRET
2. Never share your `.env` file
3. Use strong random strings for secrets (64+ characters)
4. Rotate secrets regularly in production
5. Use different values for development and production
6. Never hardcode secrets in your code
7. Never commit `.env` to version control

---

## For Production Deployment

When deploying to production 

1. Set `NODE_ENV=production`
2. Use environment variables in hosting platform (not .env file)
3. Generate NEW secrets (don't reuse dev secrets)
4. Update `CORS_ORIGIN` to your production frontend URL
5. Use stronger `BCRYPT_ROUNDS` (12-14)
6. Consider stricter rate limits

---

## Troubleshooting

**Error: "JWT_SECRET is not defined"**
- Make sure `.env` file exists in backend folder
- Verify `JWT_SECRET` line has no typos
- Restart the server after editing `.env`

**Error: "Unable to connect to database"**
- Check PostgreSQL is running
- Verify `PGHOST`, `PGPORT`, `PGDATABASE` are correct
- Check `PGUSER` and `PGPASSWORD` are correct

**CORS errors in browser:**
- Verify `CORS_ORIGIN` matches your frontend URL
- Check frontend is running on the specified port