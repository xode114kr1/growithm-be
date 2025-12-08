const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendController = require("../controllers/friend.controller");

router.post(
  "/friend-request",
  authController.findUserByToken,
  friendController.sendFriendRequest
);

module.exports = router;
