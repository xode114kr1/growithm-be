const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendRequestController = require("../controllers/friendRequest.controller");

router.get(
  "/wait",
  authController.findUserByToken,
  friendRequestController.getWaitFriendRequsets
);

router.post(
  "/",
  authController.findUserByToken,
  friendRequestController.sendFriendRequest
);

module.exports = router;
