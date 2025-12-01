const express = require("express");
const router = express.Router();
const autoController = require("../controllers/auth.controller");

router.post(
  "/github/callback",
  autoController.exchangeToken,
  autoController.findOrCreateUser,
  autoController.issueTokensAndRespond
);

module.exports = router;
