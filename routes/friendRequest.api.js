const express = require("express");
const router = express.Router();

const { startTx, endTx } = require("../middlewares/transaction");

const authController = require("../controllers/auth.controller");
const friendRequestController = require("../controllers/friendRequest.controller");

// me의 send-friend-request 리스트 요청
router.get(
  "/send/me",
  authController.findUserByToken,
  friendRequestController.getSendFriendRequsets
);

// me의 receive-friend-request 리스트 요청
router.get(
  "/receive/me",
  authController.findUserByToken,
  friendRequestController.getReceiveFriendRequsets
);

// friend-request를 생성
router.post(
  "/",
  authController.findUserByToken,
  startTx,
  friendRequestController.sendFriendRequest,
  endTx
);

// friend-request를 수락
router.post(
  "/:requestId/accept",
  authController.findUserByToken,
  startTx,
  friendRequestController.acceptFriendRequest,
  endTx
);

// friend-request를 거절
router.delete(
  "/:requestId/reject",
  authController.findUserByToken,
  startTx,
  friendRequestController.rejectFriendRequest,
  endTx
);

// friend-request를 취소
router.delete(
  "/:requestId/cancel",
  authController.findUserByToken,
  friendRequestController.cancelFriendRequest
);

module.exports = router;
