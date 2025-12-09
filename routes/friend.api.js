const express = require("express");
const router = express.Router();

const friendController = require("../controllers/friend.controller");

router.get("/", friendController.getFriendList);

module.exports = router;
