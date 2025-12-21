const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendController = require("../controllers/friend.controller");
const friendRequestController = require("../controllers/friendRequest.controller");
const { startTx } = require("../middlewares/transaction");

router.get("/", authController.findUserByToken, friendController.getFriendList);
router.delete(
  "/:friendId",
  authController.findUserByToken,
  startTx,
  friendRequestController.deleteFriendRequest,
  friendController.deleteFriend
);
module.exports = router;
