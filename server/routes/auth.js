const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const auth = require("../middleware/auth");

router.post("/login", authController.handleLogin);
module.exports = router;
