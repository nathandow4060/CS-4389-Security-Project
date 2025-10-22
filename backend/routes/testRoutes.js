const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/testController");

router.get("/test", getProducts);

module.exports = router;
