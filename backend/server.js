// Initialize server via express
// run "npm run devstart" to start local server. Each time project is saved, the server updates.
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/auth"); // ✅ add this line
const verifyToken = require("./middleware/authMiddleware"); // ✅ add this line

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Auth routes (register & login)
app.use("/api/auth", authRoutes);

// ✅ Example of protected routes using JWT middleware
app.get("/api/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

app.get("/api/wishlist", verifyToken, (req, res) => {
  res.json({ message: "Your wishlist data here.", user: req.user });
});

app.get("/api/purchase", verifyToken, (req, res) => {
  res.json({ message: "Your purchase history here.", user: req.user });
});

// Existing test routes (keep this)
app.use("/api", testRoutes);

app.get("/", (req, res) => {
  console.log("✅ Root route reached");
  res.send("Express server is running correctly!");
});
const gamesRoutes = require("./routes/gamesRoutes");
app.use("/api/games", gamesRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

//testdb.js at route folder
const testDBRoute = require("./routes/testdb");
app.use("/api", testDBRoute);

// npm i ejs; This is a view engine that can be used to render html
/*
http://localhost:8080/
the link above is how to see if the code works.
*/
