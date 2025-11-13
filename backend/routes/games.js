const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import PostgreSQL connection pool

// -----------------------------------------------------------------------------
// GET /api/games
// Returns a paginated list of all games in the database.
// Example: /api/games?limit=10&page=2
// -----------------------------------------------------------------------------
router.get("/games", async (req, res) => {
  // Extract query params with defaults (20 items per page)
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    // Query product table (games list) with pagination
    const result = await pool.query(
      "SELECT * FROM product ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // Send array of games as JSON
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving games:", err.message);
    res.status(500).json({ error: "Server error retrieving games." });
  }
});

// -----------------------------------------------------------------------------
// GET /api/games/:id
// Returns a single game's details based on its ID.
// Example: /api/games/1
// -----------------------------------------------------------------------------
router.get("/games/:id", async (req, res) => {
  const { id } = req.params; // Extract game ID from URL

  try {
    // Query database for that specific game
    const result = await pool.query(
      "SELECT * FROM product WHERE id = $1",
      [id]
    );

    // If no game found, send 404
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Game not found" });

    // Otherwise return the first result (single object)
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving game:", err.message);
    res.status(500).json({ error: "Server error retrieving game." });
  }
});

// -----------------------------------------------------------------------------
// GET /api/games/search?q=keyword
// Returns a list of games whose name or developer matches the keyword.
// Example: /api/games/search?q=Battlefield
// -----------------------------------------------------------------------------
router.get("/games/search", async (req, res) => {
  const q = req.query.q || ""; // Get query string (?q=...), default empty

  try {
    // Use ILIKE for case-insensitive partial matching (parameterized for safety)
    const result = await pool.query(
      "SELECT * FROM product WHERE name_of_product ILIKE $1 OR developer ILIKE $1",
      [`%${q}%`]
    );

    // Send search results as array
    res.json(result.rows);
  } catch (err) {
    console.error("Error searching games:", err.message);
    res.status(500).json({ error: "Server error searching games." });
  }
});

// Export router so server.js can use it
module.exports = router;
