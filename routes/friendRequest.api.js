const express = require("express");
const router = express.Router();

const { startTx, endTx } = require("../middlewares/transaction");

const authController = require("../controllers/auth.controller");
const friendRequestController = require("../controllers/friendRequest.controller");

// 내가 보낸 친구 요청 조회
router.get(
  "/me/sent",
  authController.optionalRefresh,
  authController.findUserByToken,
  friendRequestController.getSendFriendRequsets,
);

// 내가 받은 친구 요청 조회
router.get(
  "/me/received",
  authController.optionalRefresh,
  authController.findUserByToken,
  friendRequestController.getReceiveFriendRequsets,
);

// 친구 요청 생성
router.post(
  "/",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  friendRequestController.sendFriendRequest,
  endTx,
);

// 친구 요청 수락
router.patch(
  "/:requestId/accept",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  friendRequestController.acceptFriendRequest,
  endTx,
);

// 친구 요청 거절
router.delete(
  "/:requestId/reject",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  friendRequestController.rejectFriendRequest,
  endTx,
);

// 친구 요청 취소
router.delete(
  "/:requestId/cancel",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  friendRequestController.cancelFriendRequest,
  endTx,
);

module.exports = router;
