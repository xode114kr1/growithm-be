const express = require("express");
const router = express.Router();
const autoController = require("../controllers/auth.controller");

router.get(
  "/me",
  autoController.findUserByToken,
  autoController.issueTokensAndRespond
);

router.post(
  "/github/callback",
  autoController.exchangeToken,
  autoController.findOrCreateUser,
  autoController.issueTokensAndRespond
);

module.exports = router;
