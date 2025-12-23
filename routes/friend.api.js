const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendController = require("../controllers/friend.controller");
const friendRequestController = require("../controllers/friendRequest.controller");
const { startTx, endTx } = require("../middlewares/transaction");

// me의 friendList를 요청
router.get(
  "/me",
  authController.findUserByToken,
  friendController.getFriendList
);

// friend를 삭제하는 요청
// 1. friend-request를 삭제
// 2. user의 friends에서 friendId를 삭제
router.delete(
  "/:friendId",
  authController.findUserByToken,
  startTx,
  friendRequestController.deleteFriendRequest,
  friendController.deleteFriend,
  endTx
);
module.exports = router;
