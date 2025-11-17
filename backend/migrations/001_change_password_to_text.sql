-- Migration: Change password field from BYTEA to TEXT
-- This allows bcrypt hashes (which are text strings) to be stored directly
-- Run this migration on your Render database

-- For new installations or when migrating from BYTEA to TEXT:
-- This approach converts BYTEA to TEXT directly

-- Step 1: Convert BYTEA to TEXT (PostgreSQL will handle the conversion)
-- If the table is empty or you're okay with data loss, you can use:
ALTER TABLE account ALTER COLUMN password TYPE TEXT USING password::TEXT;

-- Alternative approach if the above doesn't work (for existing BYTEA data):
-- Step 1: Add temporary column
-- ALTER TABLE account ADD COLUMN password_temp TEXT;

-- Step 2: Convert BYTEA to TEXT (you may need to handle decryption here if using pgp_sym_encrypt)
-- UPDATE account SET password_temp = password::TEXT;

-- Step 3: Drop old column and rename
-- ALTER TABLE account DROP COLUMN password;
-- ALTER TABLE account RENAME COLUMN password_temp TO password;

-- Step 4: Ensure NOT NULL constraint
ALTER TABLE account ALTER COLUMN password SET NOT NULL;

-- Note: If you have existing passwords encrypted with pgp_sym_encrypt in BYTEA format:
-- 1. You'll need to decrypt them first using: pgp_sym_decrypt(password, 'your-key')
-- 2. Then re-hash them with bcrypt in your application
-- 3. Then run this migration to change the column type