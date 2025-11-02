const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// GET /api/games → return all games (limit + pagination)
router.get("/", async (req, res) => {
  try {
    // Pagination setup
    const page = parseInt(req.query.page) || 1;      // default: page 1
    const limit = parseInt(req.query.limit) || 10;   // default: 10 per page
    const offset = (page - 1) * limit;

    const query = "SELECT * FROM product ORDER BY id LIMIT $1 OFFSET $2";
    const result = await pool.query(query, [limit, offset]);

    res.json({
      page,
      limit,
      total: result.rowCount,
      games: result.rows,
    });
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ error: "Server error retrieving games." });
  }
});

// GET /api/games/:id → return single game details
router.get("/:id", async (req, res) => {
  try {
    const gameId = req.params.id;

    const query = "SELECT * FROM product WHERE id = $1";
    const result = await pool.query(query, [gameId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching game by ID:", err);
    res.status(500).json({ error: "Server error retrieving game by ID." });
  }
});

// GET /api/games/search?q= → keyword search (name, developer)
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing search query" });

    const query = `
      SELECT * FROM product 
      WHERE LOWER(name) LIKE LOWER($1) 
         OR LOWER(developer) LIKE LOWER($1)
    `;
    const values = [`%${q}%`];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error searching games:", err);
    res.status(500).json({ error: "Server error searching games." });
  }
});

module.exports = router;
