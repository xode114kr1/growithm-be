const express = require("express");
const router = express.Router();

const pendingController = require("../controllers/pending.controller");
const autoController = require("../controllers/auth.controller");

router.get(
  "/",
  autoController.findUserByToken,
  pendingController.getPendingList
);

module.exports = router;
