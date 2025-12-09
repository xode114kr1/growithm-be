const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendRequestController = require("../controllers/friendRequest.controller");

router.get(
  "/send",
  authController.findUserByToken,
  friendRequestController.getSendFriendRequsets
);

router.get(
  "/receive",
  authController.findUserByToken,
  friendRequestController.getReceiveFriendRequsets
);

router.post(
  "/",
  authController.findUserByToken,
  friendRequestController.sendFriendRequest
);

router.post(
  "/:requestId/accept",
  authController.findUserByToken,
  friendRequestController.acceptFriendRequest
);

router.delete(
  "/:requestId/reject",
  authController.findUserByToken,
  friendRequestController.rejectFriendRequest
);

router.delete(
  "/:requestId/cancel",
  authController.findUserByToken,
  friendRequestController.cancelFriendRequest
);

module.exports = router;
