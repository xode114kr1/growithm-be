const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendRequestController = require("../controllers/friendRequest.controller");

router.post(
  "/",
  authController.findUserByToken,
  friendRequestController.sendFriendRequest
);

module.exports = router;
