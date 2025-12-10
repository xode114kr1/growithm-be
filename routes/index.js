const express = require("express");

const authApi = require("./auth.api");
const userApi = require("./user.api");
const githubApi = require("./github.api");
const problemApi = require("./problem.api");
const friendRequestApi = require("./friendRequest.api");
const friendApi = require("./friend.api");

const router = express.Router();

router.use("/github", githubApi);
router.use("/auth", authApi);
router.use("/user", userApi);
router.use("/problem", problemApi);
router.use("/friend-request", friendRequestApi);
router.use("/friend", friendApi);

module.exports = router;
