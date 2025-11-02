const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error("Database test error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
