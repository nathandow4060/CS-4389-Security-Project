const PGP_ENCRYPTION_KEY =
  process.env.PGP_ENCRYPTION_KEY ||
  'c65ef18bd3a0183cedce4ff720f1f437d070194f916479d5874aef0964b62f29';

/**
 * Find user by username and decrypt password using pgp_sym_decrypt
 */
async function findUserByUsername(username) {
    const query = `
        SELECT 
            id,
            username,
            pgp_sym_decrypt(password, $2::text)::text AS password,
            age,
            email
        FROM ACCOUNT
        WHERE username = $1
    `;

    const { rows } = await db.query(query, [username, PGP_ENCRYPTION_KEY]);
    return rows[0];
}

/**
 * Create a new user with encrypted password
 */
async function postUser({username, password, age, email}) {
    const query = `
        INSERT INTO ACCOUNT (username, password, age, email)
        VALUES ($1, pgp_sym_encrypt($2, $5::text), $3, $4)
        RETURNING id
    `;

    const { rows } = await db.query(query, [username, password, age, email, PGP_ENCRYPTION_KEY]);
    return rows[0];
}