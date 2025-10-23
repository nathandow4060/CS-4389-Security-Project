// backend/controllers/testController.js
const getProducts = async (req, res) => {
  try {
    console.log("✅ /api/test route reached");
    res.json({ message: "Test route reached successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getProducts };
