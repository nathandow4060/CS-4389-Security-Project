const db = require('../db/db');

async function findUserByUsername(username) {
    const query = `
        SELECT * FROM ACCOUNT
        WHERE username = $1
    `;

    const { rows } = await db.query(query, [username]);
    return rows[0];
}

async function postUser({username, password, age, email}) {
    const query = `
        INSERT INTO ACCOUNT (username, password, age, email)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;

    const { rows } = await db.query(query, [username, password, age, email]);
    return rows[0];
}

module.exports = { findUserByUsername, postUser };