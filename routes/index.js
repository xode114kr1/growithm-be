const express = require("express");

const authApi = require("./auth.api");
const userApi = require("./user.api");
const githubApi = require("./github.api");
const problemApi = require("./problem.api");
const friendRequestApi = require("./friendRequest.api");
const friendApi = require("./friend.api");
const studyApi = require("./study.api");
const studyRequestApi = require("./studyRequest.api");

const router = express.Router();

router.use("/github", githubApi);
router.use("/auth", authApi);
router.use("/users", userApi);
router.use("/problem", problemApi);
router.use("/friend-requests", friendRequestApi);
router.use("/friends", friendApi);
router.use("/studies", studyApi);
router.use("/study-requests", studyRequestApi);

module.exports = router;
