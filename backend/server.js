//Initialize server via express
//run "npm run devstart" to start local server. Each time project is saved, the server updates.
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const testRoutes = require("./routes/testRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Register route
app.use("/api", testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


//npm i ejs; This is a view engine that can be used to render html