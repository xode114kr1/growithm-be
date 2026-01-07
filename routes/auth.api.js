const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get(
  "/me",
  authController.optionalRefresh,
  authController.findUserByToken,
  authController.issueTokensAndRespond
);

router.post(
  "/github/callback",
  authController.exchangeToken,
  authController.findOrCreateUser,
  authController.issueTokensAndRespond
);

module.exports = router;
