const express = require("express");
const router = express.Router();

const githubController = require("../controllers/github.controller");
const autoController = require("../controllers/auth.controller");

router.post(
  "/webhook/chaining",
  autoController.findUserByToken,
  githubController.webhookChaining
);

module.exports = router;
