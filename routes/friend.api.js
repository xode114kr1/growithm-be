const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendController = require("../controllers/friend.controller");
const friendRequestController = require("../controllers/friendRequest.controller");
const { startTx, endTx } = require("../middlewares/transaction");

// 내 친구 목록 조회
router.get(
  "/me",
  authController.optionalRefresh,
  authController.findUserByToken,
  friendController.getFriendList,
);

// 특정 친구 삭제
router.delete(
  "/:friendId",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  friendRequestController.deleteFriendRequest,
  friendController.deleteFriend,
  endTx,
);
module.exports = router;
