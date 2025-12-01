const express = require("express");
const router = express.Router();
const autoController = require("../controllers/auth.controller");

router.post("/github/callback", autoController.login);

module.exports = router;
