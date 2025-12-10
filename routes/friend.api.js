const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const friendController = require("../controllers/friend.controller");

router.get("/", authController.findUserByToken, friendController.getFriendList);

module.exports = router;
